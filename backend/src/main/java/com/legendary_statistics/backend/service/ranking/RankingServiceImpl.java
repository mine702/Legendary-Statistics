package com.legendary_statistics.backend.service.ranking;

import com.legendary_statistics.backend.dto.legend.GetIdAndActualFileName;
import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.LegendScoreEntity;
import com.legendary_statistics.backend.repository.file.FileLegendRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

    private final LegendScoreRepository legendScoreRepository;
    private final FileLegendRepository fileLegendRepository;
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

        List<GetIdAndActualFileName> legends = legendRepository.findAllLegendIdAndFileName(
                new ArrayList<>(labelCountMap.keySet())
        );

        Map<Long, Long> idToCountMap = legends.stream()
                .collect(Collectors.toMap(
                        GetIdAndActualFileName::getId,
                        legend -> labelCountMap.getOrDefault(legend.getActualFileName(), 0L)
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

}
