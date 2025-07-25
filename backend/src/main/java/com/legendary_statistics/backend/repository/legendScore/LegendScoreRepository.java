package com.legendary_statistics.backend.repository.legendScore;

import com.legendary_statistics.backend.entity.LegendScoreEntity;
import com.legendary_statistics.backend.repository.legendScore.custom.LegendScoreRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegendScoreRepository extends JpaRepository<LegendScoreEntity, Long>, LegendScoreRepositoryCustom {
}
