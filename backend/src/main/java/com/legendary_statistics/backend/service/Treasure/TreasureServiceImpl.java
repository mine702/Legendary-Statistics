package com.legendary_statistics.backend.service.Treasure;

import com.legendary_statistics.backend.dto.treasure.GetSimulatorRes;
import com.legendary_statistics.backend.dto.treasure.GetTreasureRes;
import com.legendary_statistics.backend.dto.treasure.probability.GetProbabilityGroupRes;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TreasureServiceImpl implements TreasureService {

    private final TreasureRepository treasureRepository;
    private final ProbabilityRepository probabilityRepository;
    private final ProbabilityGroupRepository probabilityGroupRepository;
    private final LegendRepository legendRepository;

    @Override
    public GetTreasureRes getTreasure(Long id) {
        TreasureEntity treasureEntity = treasureRepository.findById(id).orElseThrow(TreasureNotFoundException::new);
        return GetTreasureRes.of(treasureEntity);
    }

    @Override
    public List<GetTreasureRes> getTreasureList() {
        List<TreasureEntity> treasureList = treasureRepository.findByDeletedOrderByIdDesc(false);
        return GetTreasureRes.of(treasureList);
    }

    @Override
    public List<GetSimulatorRes> getSimulatorList(Long id) {
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
        List<GetSimulatorRes> result = new ArrayList<>();
        result.addAll(GetSimulatorRes.ofLegends(selectedLegends));
        result.addAll(GetSimulatorRes.ofCurrencies(selectedCurrencies));
        return result;
    }

    @Override
    public List<GetProbabilityGroupRes> getProbabilityByTreasureId(Long id) {
        return probabilityGroupRepository.getProbabilityGroupAndProbabilityByTreasureId(id);
    }
}
