package com.legendary_statistics.backend.service.Treasure;

import com.legendary_statistics.backend.dto.treasure.GetSimulatorRes;
import com.legendary_statistics.backend.dto.treasure.GetTreasureRes;
import com.legendary_statistics.backend.dto.treasure.probability.GetProbabilityGroupRes;

import java.util.List;

public interface TreasureService {

    GetTreasureRes getTreasure(Long id);

    List<GetTreasureRes> getTreasureList();

    List<GetSimulatorRes> getSimulatorList(Long id);

    List<GetProbabilityGroupRes> getProbabilityByTreasureId(Long id);

    List<GetTreasureRes> getTreasureLast();
}
