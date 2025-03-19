package com.legendary_statistics.backend.service.probability;

import com.legendary_statistics.backend.dto.excel.GetExcelLegendReq;

import java.util.List;

public interface ProbabilityService {
    void saveProbabilityExcelData(List<GetExcelLegendReq> getExcelLegendReqs, Long treasureId);
}
