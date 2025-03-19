package com.legendary_statistics.backend.dto.treasure;

import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.ProbabilityEntity;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetSimulatorListRes {
    private Long id;
    private String actualFileName;
    private String path;
    private String name;
    private Integer star;  // 화폐 개념에서는 사용 안 함

    // 🔹 [유닛(LegendEntity) 변환]
    public static GetSimulatorListRes of(LegendEntity entity) {
        return GetSimulatorListRes.builder()
                .id(entity.getId())
                .actualFileName(entity.getFileEntity() != null ? entity.getFileEntity().getActualFileName() : null)
                .path(entity.getFileEntity() != null ? entity.getFileEntity().getPath() : null)
                .name(entity.getName())
                .star(entity.getStar())  // 유닛일 경우에만 사용
                .build();
    }

    // 🔹 [화폐 개념(ProbabilityEntity) 변환]
    public static GetSimulatorListRes of(ProbabilityEntity entity) {
        return GetSimulatorListRes.builder()
                .id(entity.getId())  // ProbabilityEntity의 ID 사용
                .name(entity.getName())  // 화폐 이름
                .build();
    }

    // 🔹 [유닛(LegendEntity) 리스트 변환]
    public static List<GetSimulatorListRes> ofLegends(List<LegendEntity> legendEntities) {
        return legendEntities.stream()
                .map(GetSimulatorListRes::of)
                .collect(Collectors.toList());
    }

    // 🔹 [화폐 개념(ProbabilityEntity) 리스트 변환]
    public static List<GetSimulatorListRes> ofCurrencies(List<ProbabilityEntity> currencyEntities) {
        return currencyEntities.stream()
                .map(GetSimulatorListRes::of)
                .collect(Collectors.toList());
    }
}
