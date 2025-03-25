package com.legendary_statistics.backend.service.file;

import com.legendary_statistics.backend.entity.FileLegendEntity;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.repository.file.FileLegendRepository;
import com.legendary_statistics.backend.repository.kind.KindRepository;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FileService {

    private final LegendRepository legendRepository;
    private final KindRepository kindRepository;
    private final FileLegendRepository fileLegendRepository;

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
}
