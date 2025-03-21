package com.legendary_statistics.backend.repository.probabilityGroup.custom;

import com.legendary_statistics.backend.dto.treasure.probability.GetProbabilityGroupRes;

import java.util.List;

public interface ProbabilityGroupRepositoryCustom {
    List<GetProbabilityGroupRes> getProbabilityGroupAndProbabilityByTreasureId(Long id);
}
