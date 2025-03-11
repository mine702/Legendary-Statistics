package com.legendary_statistics.backend.service.kind;

import com.legendary_statistics.backend.dto.kind.GetKindListRes;
import com.legendary_statistics.backend.entity.FileEntity;
import com.legendary_statistics.backend.repository.kind.KindRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class KindServiceImpl implements KindService {

    private final KindRepository kindRepository;

    @Override
    public List<GetKindListRes> getKindList() {
        return kindRepository.findAll().stream().map(
                kindEntity -> GetKindListRes.builder()
                        .id(kindEntity.getId())
                        .actualFileName(Optional.ofNullable(kindEntity.getFile()).map(FileEntity::getActualFileName).orElse("파일 없음"))
                        .path(Optional.ofNullable(kindEntity.getFile()).map(FileEntity::getPath).orElse("경로 없음"))
                        .name(kindEntity.getName())
                        .isDeleted(kindEntity.getDeleted())
                        .build()
        ).toList();
    }
}
