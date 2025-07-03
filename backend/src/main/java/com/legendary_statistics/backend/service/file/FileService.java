package com.legendary_statistics.backend.service.file;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legendary_statistics.backend.entity.FileLegendEntity;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.global.exception.file.JsonFileRuntimeException;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.repository.file.FileLegendRepository;
import com.legendary_statistics.backend.repository.kind.KindRepository;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FileService {

    private final LegendRepository legendRepository;
    private final KindRepository kindRepository;
    private final FileLegendRepository fileLegendRepository;
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
}
