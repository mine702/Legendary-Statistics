package com.legendary_statistics.backend.service.ranking;

import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RankingService {
    Page<GetRankingRes> getRanking(Pageable pageable, Long kind, Boolean limit, Long rate, Integer year, String keyword);
}
