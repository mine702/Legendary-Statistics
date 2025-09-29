package com.legendary_statistics.backend.service.reroll;

import com.legendary_statistics.backend.dto.reroll.GetChampionRes;
import com.legendary_statistics.backend.dto.reroll.GetRerollProbabilityRes;
import com.legendary_statistics.backend.dto.reroll.GetSeasonRes;
import com.legendary_statistics.backend.dto.reroll.GetSynergyRes;
import com.legendary_statistics.backend.entity.RerollProbabilityEntity;
import com.legendary_statistics.backend.entity.SeasonEntity;
import com.legendary_statistics.backend.entity.SynergyEntity;
import com.legendary_statistics.backend.global.exception.reroll.SeasonNotFoundException;
import com.legendary_statistics.backend.repository.champion.ChampionRepository;
import com.legendary_statistics.backend.repository.rerollProbability.RerollProbabilityRepository;
import com.legendary_statistics.backend.repository.season.SeasonRepository;
import com.legendary_statistics.backend.repository.synergy.SynergyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class RerollServiceImpl implements RerollServie {

    private final SeasonRepository seasonRepository;
    private final RerollProbabilityRepository rerollProbabilityRepository;
    private final ChampionRepository championRepository;
    private final SynergyRepository synergyRepository;

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
                .level6(rerollProbabilityEntity.getLevel6())
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

    @Override
    public List<GetChampionRes> getChampionList(Long seasonId) {
        SeasonEntity seasonEntity = seasonRepository.findById(seasonId).orElseThrow(SeasonNotFoundException::new);

        return championRepository.findBySeasonEntityAndNotSaleFalse(seasonEntity).stream().map(
                championEntity -> GetChampionRes.builder()
                        .id(championEntity.getId())
                        .cost(championEntity.getCost())
                        .name(championEntity.getName())
                        .path(championEntity.getPath())
                        .squarePath(championEntity.getSquarePath())
                        .mobilePath(championEntity.getMobilePath())
                        .synergyList(Stream.of(championEntity.getSynergyEntity1(), championEntity.getSynergyEntity2(), championEntity.getSynergyEntity3())
                                .filter(Objects::nonNull)
                                .map(SynergyEntity::getId)
                                .collect(toList())
                        )
                        .build()).toList();
    }

    @Override
    public List<GetSynergyRes> getSynergyList(Long seasonId) {
        SeasonEntity seasonEntity = seasonRepository.findById(seasonId).orElseThrow(SeasonNotFoundException::new);

        return synergyRepository.findBySeasonEntity(seasonEntity).stream().map(
                synergyEntity -> GetSynergyRes.builder()
                        .id(synergyEntity.getId())
                        .name(synergyEntity.getName())
                        .desc(synergyEntity.getDesc())
                        .path(synergyEntity.getPath())
                        .build()).toList();
    }
}
