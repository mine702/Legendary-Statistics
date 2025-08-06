package com.legendary_statistics.backend.service.newLegend;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes;
import com.legendary_statistics.backend.dto.newLegend.GetNewLegendRes;

import java.util.List;

public interface NewLegendService {

    List<GetNewLegendListRes> getNewLegendList();

    GetNewLegendRes getNewLegendDetail(Long id);
}
