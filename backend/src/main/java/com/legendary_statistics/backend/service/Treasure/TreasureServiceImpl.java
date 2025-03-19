package com.legendary_statistics.backend.service.Treasure;

import com.legendary_statistics.backend.dto.treasure.GetSimulatorListRes;
import com.legendary_statistics.backend.dto.treasure.GetTreasureListRes;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.ProbabilityEntity;
import com.legendary_statistics.backend.entity.ProbabilityGroupEntity;
import com.legendary_statistics.backend.entity.TreasureEntity;
import com.legendary_statistics.backend.global.exception.treasure.TreasureNotFoundException;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import com.legendary_statistics.backend.repository.probability.ProbabilityRepository;
import com.legendary_statistics.backend.repository.probabilityGroup.ProbabilityGroupRepository;
import com.legendary_statistics.backend.repository.treasure.TreasureRepository;
import com.legendary_statistics.backend.util.ProbabilityPicker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TreasureServiceImpl implements TreasureService {

    private final TreasureRepository treasureRepository;
    private final ProbabilityRepository probabilityRepository;
    private final ProbabilityGroupRepository probabilityGroupRepository;
    private final LegendRepository legendRepository;

    @Override
    public List<GetTreasureListRes> getTreasureList() {
        List<TreasureEntity> treasureList = treasureRepository.findByDeleted(false);
        return GetTreasureListRes.of(treasureList);
    }

    @Override
    public List<GetSimulatorListRes> getSimulatorList(Long id) {
        TreasureEntity treasureEntity = treasureRepository.findById(id)
                .orElseThrow(TreasureNotFoundException::new);

        List<ProbabilityGroupEntity> probabilityGroupEntities = probabilityGroupRepository.findByTreasureEntity(treasureEntity);
        List<LegendEntity> selectedLegends = new ArrayList<>();
        List<ProbabilityEntity> selectedCurrencies = new ArrayList<>();  // 화폐 개념 저장용

        for (int i = 0; i < 10; i++) {
            ProbabilityGroupEntity selectedGroup = ProbabilityPicker.pickGroupByProbability(probabilityGroupEntities);
            if (selectedGroup == null) continue;

            ProbabilityEntity selectedProbability = ProbabilityPicker.pickLegendOrCurrency(selectedGroup.getProbabilityEntities());
            if (selectedProbability != null) {
                if (selectedProbability.getLegendEntity() != null) {
                    selectedLegends.add(selectedProbability.getLegendEntity());
                } else {
                    selectedCurrencies.add(selectedProbability);
                }
            }
        }

        List<GetSimulatorListRes> result = new ArrayList<>();
        result.addAll(GetSimulatorListRes.ofLegends(selectedLegends));
        result.addAll(GetSimulatorListRes.ofCurrencies(selectedCurrencies));

        return result;
    }

}
