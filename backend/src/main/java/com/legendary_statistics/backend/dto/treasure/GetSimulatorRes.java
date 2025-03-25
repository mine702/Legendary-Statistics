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
public class GetSimulatorRes {
    private Long id;
    private String actualFileName;
    private String path;
    private String name;
    private Long rate;
    private Integer star;

    // [유닛(LegendEntity) 변환]
    public static GetSimulatorRes of(LegendEntity entity) {
        return GetSimulatorRes.builder()
                .id(entity.getId())
                .actualFileName(entity.getFileLegendEntity() != null ? entity.getFileLegendEntity().getActualFileName() : null)
                .path(entity.getFileLegendEntity() != null ? entity.getFileLegendEntity().getPath() : null)
                .name(entity.getName())
                .rate(entity.getRateEntity().getId())
                .star(entity.getStar())
                .build();
    }

    // [유닛(LegendEntity) 리스트 변환]
    public static List<GetSimulatorRes> ofLegends(List<LegendEntity> legendEntities) {
        return legendEntities.stream()
                .map(GetSimulatorRes::of)
                .collect(Collectors.toList());
    }

    // [화폐 개념(ProbabilityEntity) 변환]
    public static GetSimulatorRes of(ProbabilityEntity entity) {
        return GetSimulatorRes.builder()
                .id(entity.getId())
                .actualFileName(entity.getCurrencyEntity().getFileCurrencyEntity() != null ? entity.getCurrencyEntity().getFileCurrencyEntity().getActualFileName() : null)
                .path(entity.getCurrencyEntity().getFileCurrencyEntity() != null ? entity.getCurrencyEntity().getFileCurrencyEntity().getPath() : null)
                .name(entity.getName())
                .rate(6L)
                .build();
    }

    // [화폐 개념(ProbabilityEntity) 리스트 변환]
    public static List<GetSimulatorRes> ofCurrencies(List<ProbabilityEntity> currencyEntities) {
        return currencyEntities.stream()
                .map(GetSimulatorRes::of)
                .collect(Collectors.toList());
    }
}
