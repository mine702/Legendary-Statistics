package com.legendary_statistics.backend.service.Legend;

import com.legendary_statistics.backend.dto.legend.GetLegendListRes;

import java.util.List;

public interface LegendService {
    List<GetLegendListRes> getLegendListByKind(long id);

    GetLegendListRes getLegendByName(String name);
}
