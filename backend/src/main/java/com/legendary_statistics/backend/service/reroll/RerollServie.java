package com.legendary_statistics.backend.service.reroll;

import com.legendary_statistics.backend.dto.reroll.GetChampionRes;
import com.legendary_statistics.backend.dto.reroll.GetRerollProbabilityRes;
import com.legendary_statistics.backend.dto.reroll.GetSeasonRes;
import com.legendary_statistics.backend.dto.reroll.GetSynergyRes;

import java.util.List;

public interface RerollServie {
    GetRerollProbabilityRes getProbability(Long seasonId, Integer userLevel);

    List<GetSeasonRes> getSeasons();

    List<GetChampionRes> getChampionList(Long seasonId);

    List<GetSynergyRes> getSynergyList(Long seasonId);
}
