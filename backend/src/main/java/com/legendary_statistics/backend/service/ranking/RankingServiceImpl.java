package com.legendary_statistics.backend.service.ranking;

import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import com.legendary_statistics.backend.repository.legendScore.LegendScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

    private final LegendScoreRepository legendScoreRepository;

    @Override
    public Page<GetRankingRes> getRanking(Pageable pageable, Long kind, Boolean limit, Long rate, Integer year, String keyword) {
        PageRequest orderedPageable = PageRequest.of(pageable.getPageNumber(),
                pageable.getPageSize(), Sort.by("id").descending());
        return legendScoreRepository.findAllByLegend(orderedPageable, kind, limit, rate, year, keyword);
    }
}
