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
public class GetTreasureRes {
    private Long id;
    private String actualFileName;
    private String path;
    private Long legendId;
    private String name;

    // 단일 객체 변환
    public static GetTreasureRes of(TreasureEntity entity) {
        return GetTreasureRes.builder()
                .id(entity.getId())
                .actualFileName(entity.getLegendEntity().getFileLegendEntity() != null ? entity.getLegendEntity().getFileLegendEntity().getActualFileName() : null)
                .path(entity.getLegendEntity().getFileLegendEntity() != null ? entity.getLegendEntity().getFileLegendEntity().getPath() : null)
                .legendId(entity.getLegendEntity() != null ? entity.getLegendEntity().getId() : null)
                .name(entity.getName())
                .build();
    }

    // 리스트 변환
    public static List<GetTreasureRes> of(List<TreasureEntity> treasureEntities) {
        return treasureEntities.stream()
                .map(GetTreasureRes::of)
                .collect(Collectors.toList());
    }
}
