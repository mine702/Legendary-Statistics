package com.legendary_statistics.backend.service.reroll;

import com.legendary_statistics.backend.dto.reroll.GetRerollProbabilityRes;
import com.legendary_statistics.backend.dto.reroll.GetSeasonRes;
import com.legendary_statistics.backend.entity.RerollProbabilityEntity;
import com.legendary_statistics.backend.entity.SeasonEntity;
import com.legendary_statistics.backend.global.exception.reroll.SeasonNotFoundException;
import com.legendary_statistics.backend.repository.rerollProbability.RerollProbabilityRepository;
import com.legendary_statistics.backend.repository.season.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RerollServiceImpl implements RerollServie {

    private final SeasonRepository seasonRepository;
    private final RerollProbabilityRepository rerollProbabilityRepository;

    @Override
    public GetRerollProbabilityRes getProbability(Long seasonId, Integer userLevel) {
        SeasonEntity seasonEntity = seasonRepository.findById(seasonId).orElseThrow(SeasonNotFoundException::new);
        RerollProbabilityEntity rerollProbabilityEntity = rerollProbabilityRepository.findBySeasonEntityAndUserLevel(seasonEntity, userLevel).orElseThrow(SeasonNotFoundException::new);

        return GetRerollProbabilityRes.builder()
                .level1(rerollProbabilityEntity.getLevel1())
                .level2(rerollProbabilityEntity.getLevel2())
                .level3(rerollProbabilityEntity.getLevel3())
                .level4(rerollProbabilityEntity.getLevel4())
                .level5(rerollProbabilityEntity.getLevel5())
                .build();
    }

    @Override
    public List<GetSeasonRes> getSeasons() {
        return seasonRepository.findAllByOrderByStartAtDesc().stream().map(
                seasonEntity -> GetSeasonRes.builder()
                        .id(seasonEntity.getId())
                        .seasonNo(seasonEntity.getSeasonNo())
                        .startAt(seasonEntity.getStartAt())
                        .endAt(seasonEntity.getEndAt())
                        .build()).toList();
    }
}
