package com.legendary_statistics.backend.repository.legendScore.custom;

import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LegendScoreRepositoryCustom {

    Page<GetRankingRes> findAllByLegend(Pageable pageable, Long kind, Boolean limit, Long rate, Integer year, String keyword);

    void setScoreByLabels(List<String> labels);
}
