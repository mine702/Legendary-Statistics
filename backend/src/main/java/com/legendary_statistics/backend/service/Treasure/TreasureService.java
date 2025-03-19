package com.legendary_statistics.backend.service.Treasure;

import com.legendary_statistics.backend.dto.treasure.GetSimulatorListRes;
import com.legendary_statistics.backend.dto.treasure.GetTreasureListRes;

import java.util.List;

public interface TreasureService {

    List<GetTreasureListRes> getTreasureList();

    List<GetSimulatorListRes> getSimulatorList(Long id);
}
