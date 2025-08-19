package com.legendary_statistics.backend.repository.legend.custom;

import com.legendary_statistics.backend.dto.legend.GetIdAndActualFileNameRes;
import com.legendary_statistics.backend.dto.legend.GetLegendListRes;
import com.legendary_statistics.backend.entity.KindEntity;

import java.util.List;

public interface LegendRepositoryCustom {
    List<GetLegendListRes> findLegendListByKind(KindEntity kind);

    List<GetIdAndActualFileNameRes> findAllLegendIdAndFileName(List<String> actualFileNames);

    List<GetLegendListRes> findLegendListLast();
}
