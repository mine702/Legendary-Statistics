package com.legendary_statistics.backend.util;

import com.legendary_statistics.backend.entity.ProbabilityEntity;
import com.legendary_statistics.backend.entity.ProbabilityGroupEntity;

import java.util.ArrayList;
import java.util.List;

public class ProbabilityPicker {

    /**
     * 확률 기반으로 ProbabilityGroupEntity 선택
     */
    public static ProbabilityGroupEntity pickGroupByProbability(List<ProbabilityGroupEntity> probabilityGroups) {
        List<Double> cumulativeProbabilities = new ArrayList<>();
        double cumulativeSum = 0.0;

        for (ProbabilityGroupEntity group : probabilityGroups) {
            cumulativeSum += group.getProbability();
            cumulativeProbabilities.add(cumulativeSum);
        }

        double randomValue = Math.random() * cumulativeSum;

        for (int i = 0; i < cumulativeProbabilities.size(); i++) {
            if (randomValue < cumulativeProbabilities.get(i)) {
                return probabilityGroups.get(i);
            }
        }

        return probabilityGroups.get(probabilityGroups.size() - 1);  // 기본적으로 마지막 그룹 선택
    }

    /**
     * 확률 기반으로 ProbabilityEntity 선택 (LegendEntity 또는 Currency)
     */
    public static ProbabilityEntity pickLegendOrCurrency(List<ProbabilityEntity> probabilityEntities) {
        List<Double> cumulativeProbabilities = new ArrayList<>();
        double cumulativeSum = 0.0;

        for (ProbabilityEntity entity : probabilityEntities) {
            cumulativeSum += entity.getProbability();
            cumulativeProbabilities.add(cumulativeSum);
        }

        double randomValue = Math.random() * cumulativeSum;

        for (int i = 0; i < cumulativeProbabilities.size(); i++) {
            if (randomValue < cumulativeProbabilities.get(i)) {
                return probabilityEntities.get(i);
            }
        }

        return probabilityEntities.get(probabilityEntities.size() - 1); // 기본적으로 마지막 엔티티 선택
    }
}
