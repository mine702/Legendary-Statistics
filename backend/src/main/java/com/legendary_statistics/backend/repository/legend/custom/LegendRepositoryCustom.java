package com.legendary_statistics.backend.repository.legend.custom;

import com.legendary_statistics.backend.dto.legend.GetLegendListRes;
import com.legendary_statistics.backend.entity.KindEntity;

import java.util.List;

public interface LegendRepositoryCustom {
    List<GetLegendListRes> findLegendListByKind(KindEntity kind);
}
