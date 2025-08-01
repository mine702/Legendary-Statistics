package com.legendary_statistics.backend.repository.legendScore;

import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.LegendScoreEntity;
import com.legendary_statistics.backend.repository.legendScore.custom.LegendScoreRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegendScoreRepository extends JpaRepository<LegendScoreEntity, Long>, LegendScoreRepositoryCustom {
    Optional<LegendScoreEntity> findByLegendEntity(LegendEntity legend);

    List<LegendScoreEntity> findAllByLegendEntityIn(List<LegendEntity> legendEntities);
}
