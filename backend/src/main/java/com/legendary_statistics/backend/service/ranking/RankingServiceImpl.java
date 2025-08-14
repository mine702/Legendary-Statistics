package com.legendary_statistics.backend.service.ranking;

import com.legendary_statistics.backend.dto.legend.GetIdAndActualFileNameRes;
import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.LegendScoreEntity;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import com.legendary_statistics.backend.repository.legendScore.LegendScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

    private final LegendScoreRepository legendScoreRepository;
    private final LegendRepository legendRepository;

    @Override
    public Page<GetRankingRes> getRanking(Pageable pageable, Long kind, Boolean limit, Long rate, Integer year, String keyword) {
        PageRequest orderedPageable = PageRequest.of(pageable.getPageNumber(),
                pageable.getPageSize(), Sort.by("id").descending());
        return legendScoreRepository.findAllByLegend(orderedPageable, kind, limit, rate, year, keyword);
    }

    @Override
    @Transactional
    public void setScoreByLabels(List<String> labels) {
        if (labels == null || labels.isEmpty()) return;

        Map<String, Long> labelCountMap = labels.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<GetIdAndActualFileNameRes> legends = legendRepository.findAllLegendIdAndFileName(
                new ArrayList<>(labelCountMap.keySet())
        );

        List<GetIdAndActualFileNameRes> resolvedLegends = new ArrayList<>();

        for (GetIdAndActualFileNameRes dto : legends) {
            if (dto.getStar() == 1) {
                resolvedLegends.add(dto);
            } else {
                Optional<LegendEntity> oneStarLegend = legendRepository.findByNameAndStar(dto.getName(), 1);

                if (oneStarLegend.isPresent()) {
                    LegendEntity entity = oneStarLegend.get();
                    GetIdAndActualFileNameRes mappedDto = new GetIdAndActualFileNameRes();
                    mappedDto.setId(entity.getId());
                    mappedDto.setActualFileName(dto.getActualFileName());
                    resolvedLegends.add(mappedDto);
                } else {
                    log.warn("1성 매핑 실패: " + dto.getName() + ", star=" + dto.getStar());
                }
            }
        }

        Map<Long, Long> idToCountMap = resolvedLegends.stream()
                .collect(Collectors.toMap(
                        GetIdAndActualFileNameRes::getId,
                        legend -> labelCountMap.getOrDefault(legend.getActualFileName(), 0L),
                        Long::sum // 중복된 ID가 있을 경우 count를 합치기
                ));

        // 미리 해당 LegendEntity들 로딩
        List<LegendEntity> legendEntities = legendRepository.findAllById(idToCountMap.keySet());

        // 기존 score 데이터 가져오기
        List<LegendScoreEntity> existingScores = legendScoreRepository.findAllByLegendEntityIn(legendEntities);
        Map<Long, LegendScoreEntity> legendIdToScoreMap = existingScores.stream()
                .collect(Collectors.toMap(
                        s -> s.getLegendEntity().getId(),
                        Function.identity()
                ));

        int currentYear = LocalDate.now().getYear();
        List<LegendScoreEntity> toSave = new ArrayList<>();

        for (LegendEntity legend : legendEntities) {
            Long count = idToCountMap.getOrDefault(legend.getId(), 0L);

            LegendScoreEntity score = legendIdToScoreMap.getOrDefault(
                    legend.getId(),
                    LegendScoreEntity.builder()
                            .legendEntity(legend)
                            .year(currentYear)
                            .score(0)
                            .build()
            );

            score.setScore(score.getScore() + count.intValue());
            toSave.add(score);
        }

        legendScoreRepository.saveAll(toSave);
    }

    @Override
    @Transactional
    public void initScore() {
        int year = java.time.LocalDate.now().getYear();

        List<LegendEntity> legends = legendRepository.findAllByStar(1);

        Set<Long> legendIds = legends.stream().map(LegendEntity::getId).collect(Collectors.toSet());
        Set<Long> already = legendScoreRepository.findLegendIdsWithScoreInYear(legendIds, year);

        List<LegendScoreEntity> toSave = new ArrayList<>();
        for (LegendEntity legend : legends) {
            if (already.contains(legend.getId())) continue;
            toSave.add(LegendScoreEntity.builder()
                    .legendEntity(legend)
                    .year(year)
                    .score(0)
                    .build());
        }
        if (!toSave.isEmpty()) legendScoreRepository.saveAll(toSave);
    }

    @Override
    @Transactional
    public void setRandomScore() {
        Random random = new Random();
        List<LegendScoreEntity> legendScoreEntities = legendScoreRepository.findAll();

        legendScoreEntities.forEach(
                legendScoreEntity -> legendScoreEntity.setScore(legendScoreEntity.getScore() + random.nextInt(3) + 1)
        );

        legendScoreRepository.saveAll(legendScoreEntities);
    }
}
