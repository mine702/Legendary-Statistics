package com.legendary_statistics.backend.service.probability;

import com.legendary_statistics.backend.dto.excel.GetExcelLegendReq;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.ProbabilityEntity;
import com.legendary_statistics.backend.entity.TreasureEntity;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.global.exception.treasure.TreasureNotFoundException;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import com.legendary_statistics.backend.repository.probability.ProbabilityRepository;
import com.legendary_statistics.backend.repository.treasure.TreasureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProbabilityServiceImpl implements ProbabilityService {

    private final LegendRepository legendRepository;
    private final TreasureRepository treasureRepository;
    private final ProbabilityRepository probabilityRepository;

    @Transactional
    @Override
    public void saveProbabilityExcelData(List<GetExcelLegendReq> getExcelLegendReqs, Long treasureId) {
        TreasureEntity treasureEntity = treasureRepository.findById(treasureId).orElseThrow(TreasureNotFoundException::new);

        List<ProbabilityEntity> probabilityEntities = new ArrayList<>();

        for (GetExcelLegendReq legend : getExcelLegendReqs) {
            LegendEntity legendEntity = legendRepository.findIdByNameAndStar(legend.getName(), legend.getStar())
                    .orElseThrow(LegendNotFoundException::new);

            ProbabilityEntity probabilityEntity = ProbabilityEntity.builder()
                    .treasureEntity(treasureEntity)
                    .legendEntity(legendEntity)
                    .name(legend.getName())
                    .probability(legend.getProbability())
                    .build();

            probabilityEntities.add(probabilityEntity);
        }
        probabilityRepository.saveAll(probabilityEntities);
    }
}

