package com.legendary_statistics.backend.service.reroll;

import com.legendary_statistics.backend.dto.reroll.GetRerollProbabilityRes;
import com.legendary_statistics.backend.dto.reroll.GetSeasonRes;

import java.util.List;

public interface RerollServie {
    GetRerollProbabilityRes getProbability(Long seasonId, Integer userLevel);

    List<GetSeasonRes> getSeasons();
}
