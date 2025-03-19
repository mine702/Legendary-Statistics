package com.legendary_statistics.backend.dto.treasure;

import com.legendary_statistics.backend.entity.TreasureEntity;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetTreasureListRes {
    private Long id;
    private String actualFileName;
    private String path;
    private String name;

    // 단일 객체 변환
    public static GetTreasureListRes of(TreasureEntity entity) {
        return GetTreasureListRes.builder()
                .id(entity.getId())
                .actualFileName(entity.getFileEntity() != null ? entity.getFileEntity().getActualFileName() : null)
                .path(entity.getFileEntity() != null ? entity.getFileEntity().getPath() : null)
                .name(entity.getName())
                .build();
    }

    // 리스트 변환
    public static List<GetTreasureListRes> of(List<TreasureEntity> treasureEntities) {
        return treasureEntities.stream()
                .map(GetTreasureListRes::of)
                .collect(Collectors.toList());
    }
}
