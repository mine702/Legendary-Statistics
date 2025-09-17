package com.legendary_statistics.backend.service.reroll;

import com.legendary_statistics.backend.dto.reroll.GetRerollProbabilityRes;

public interface RerollServie {
    GetRerollProbabilityRes getProbability(Long seasonId, Integer userLevel);
}
