package com.legendary_statistics.backend.repository.legendScore;

import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.entity.LegendScoreEntity;
import com.legendary_statistics.backend.repository.legendScore.custom.LegendScoreRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface LegendScoreRepository extends JpaRepository<LegendScoreEntity, Long>, LegendScoreRepositoryCustom {
    Optional<LegendScoreEntity> findByLegendEntity(LegendEntity legend);

    List<LegendScoreEntity> findAllByLegendEntityIn(List<LegendEntity> legendEntities);

    boolean existsByLegendEntityIdAndYear(Long legendId, Integer year);

    @Query("select ls.legendEntity.id from LegendScoreEntity ls where ls.year = :year and ls.legendEntity.id in :legendIds")
    Set<Long> findLegendIdsWithScoreInYear(@Param("legendIds") Collection<Long> legendIds, @Param("year") Integer year);
}
