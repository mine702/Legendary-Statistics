package com.legendary_statistics.backend.service.file;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.config.LegendaryConfigure;
import com.legendary_statistics.backend.dto.board.GetFileRes;
import com.legendary_statistics.backend.entity.FileEntity;
import com.legendary_statistics.backend.entity.FileLegendEntity;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.UserEntity;
import com.legendary_statistics.backend.global.exception.file.JsonFileRuntimeException;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.global.exception.user.UserNotFoundException;
import com.legendary_statistics.backend.module.CommunityDragonImageDownload;
import com.legendary_statistics.backend.repository.file.FileLegendRepository;
import com.legendary_statistics.backend.repository.file.FileRepository;
import com.legendary_statistics.backend.repository.kind.KindRepository;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import com.legendary_statistics.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Principal;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FileService {

    private final LegendaryConfigure configure;
    private final UserRepository userRepository;
    private final LegendRepository legendRepository;
    private final KindRepository kindRepository;
    private final FileLegendRepository fileLegendRepository;
    private final FileRepository fileRepository;
    private final ObjectMapper objectMapper;

    public void uploadLegend() {
        List<LegendEntity> all = legendRepository.findAll();
        List<FileLegendEntity> fileEntities = new LinkedList<>();

        all.forEach(legendEntity -> {
            if (legendEntity.getFileLegendEntity() == null) {
                FileLegendEntity file = FileLegendEntity.builder()
                        .actualFileName(String.valueOf(legendEntity.getId()))
                        .path("uploads/legend/" + legendEntity.getKindEntity().getId() + "/" + legendEntity.getId() + ".png")
                        .build();

                fileEntities.add(file);
                legendEntity.setFileLegendEntity(file);
            }
        });

        fileLegendRepository.saveAll(fileEntities);
    }

    public void uploadKind() {
        kindRepository.findAll().forEach(kindEntity -> {
            if (kindEntity.getFileLegendEntity() == null) {
                LegendEntity legendEntity = legendRepository.findFirstByKindEntityOrderByIdAsc(kindEntity).orElseThrow(LegendNotFoundException::new);
                kindEntity.setFileLegendEntity(legendEntity.getFileLegendEntity());
            }
        });
    }

    public File filterCommunityDragonJson(MultipartFile file) {
        try {
            JsonNode root = objectMapper.readTree(file.getInputStream());
            JsonNode itemsNode = root.get("items");
            JsonNode setDataNode = root.get("setData");

            // 각각 key 붙은 JSON 객체로 만들어줌
            ObjectNode itemsWrapper = objectMapper.createObjectNode();
            itemsWrapper.set("items", itemsNode);

            ObjectNode setDataWrapper = objectMapper.createObjectNode();
            setDataWrapper.set("setData", setDataNode);

            // 파일 저장
            File itemsFile = new File("items.json");
            File setDataFile = new File("setData.json");

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(itemsFile, itemsWrapper);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(setDataFile, setDataWrapper);

            // ZIP으로 묶기
            File zipFile = new File("CommunityDragonJson.zip");
            try (FileOutputStream fos = new FileOutputStream(zipFile);
                 ZipOutputStream zos = new ZipOutputStream(fos)) {

                zipAdd(itemsFile, zos);
                zipAdd(setDataFile, zos);
            }

            if (!itemsFile.delete()) log.error("⚠ itemsFile 삭제 실패");
            if (!setDataFile.delete()) log.error("⚠ setDataFile 삭제 실패");

            return zipFile;

        } catch (IOException e) {
            throw new JsonFileRuntimeException();
        }
    }

    // 헬퍼 메서드: 파일을 ZIP에 추가
    private void zipAdd(File file, ZipOutputStream zos) throws IOException {
        try (FileInputStream fis = new FileInputStream(file)) {
            ZipEntry zipEntry = new ZipEntry(file.getName());
            zos.putNextEntry(zipEntry);

            byte[] buffer = new byte[1024];
            int length;
            while ((length = fis.read(buffer)) >= 0) {
                zos.write(buffer, 0, length);
            }

            zos.closeEntry();
        }
    }

    public GetFileRes uploadBoardFile(MultipartFile file, Principal principal) throws IOException {
        long userId = JwtAuthentication.getUserId(principal);
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        LocalDate today = LocalDate.now();

        Path dailyPath = Path.of(
                Integer.toString(today.getYear()),
                Integer.toString(today.getMonth().getValue()),
                Integer.toString(today.getDayOfMonth())
        );

        Path saveAbsolutePathWithoutFileName = Path.of(configure.getFileUploadPath(), dailyPath.toString());
        String fileName = file.getOriginalFilename() + UUID.randomUUID();

        Path saveAbsolutePath = Path.of(saveAbsolutePathWithoutFileName.toString(), fileName);
        Path saveRelativePath = Path.of("board", dailyPath.toString(), fileName);

        new File(saveAbsolutePathWithoutFileName.toString()).mkdirs();
        Files.copy(file.getInputStream(), saveAbsolutePath);

        FileEntity fileEntity = FileEntity.builder()
                .userEntity(userEntity)
                .actualFileName(file.getOriginalFilename())
                .size(file.getSize())
                .path(saveRelativePath.toString())
                .uploadAt(today)
                .build();

        FileEntity save = fileRepository.save(fileEntity);

        return GetFileRes.builder()
                .id(save.getId())
                .actualFileName(save.getActualFileName())
                .path(save.getPath())
                .size(save.getSize())
                .build();
    }

    @Transactional
    public void uploadCommunityDragonLegend() throws Exception {
        CommunityDragonImageDownload communityDragonImageDownload = new CommunityDragonImageDownload();

        List<FileLegendEntity> fileLegendEntities = communityDragonImageDownload.downloadAllImages(configure.getFileLegendUploadPath()).stream()
                .map(fileName -> FileLegendEntity.builder()
                        .actualFileName(fileName)
                        .path("uploads/legend/" + fileName)
                        .build())
                .toList();

        fileLegendRepository.saveAll(fileLegendEntities);

        List<LegendEntity> legendEntities = new LinkedList<>();
        for (FileLegendEntity fileLegendEntity : fileLegendEntities) {
            log.info("file id = {}", fileLegendEntity.getId());

            String[] parts = fileLegendEntity.getActualFileName()
                    .replace(".png", "")
                    .split("_");

            int star = parseStarFromParts(parts);

            legendEntities.add(
                    LegendEntity.builder()
                            .kindEntity(kindRepository.findByEn(parts[1]).orElse(null))
                            .fileLegendEntity(fileLegendEntity)
                            .rateEntity(null)
                            .name(fileLegendEntity.getActualFileName())
                            .star(star)
                            .limited(false)
                            .animation(false)
                            .build()
            );
        }

        legendRepository.saveAll(legendEntities);
    }

    private int parseStarFromParts(String[] parts) {
        for (String part : parts) {
            if (part.startsWith("tier")) {
                try {
                    String number = part.replaceAll("[^0-9]", "");
                    return Integer.parseInt(number);
                } catch (NumberFormatException e) {
                    log.warn("tier 파싱 실패: {}", part, e);
                    return 1;
                }
            }
        }
        return 1;
    }

}
