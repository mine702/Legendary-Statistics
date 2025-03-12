package com.legendary_statistics.backend.repository.legend;

import com.legendary_statistics.backend.entity.LegendEntity;
import com.legendary_statistics.backend.repository.legend.custom.LegendRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegendRepository extends JpaRepository<LegendEntity, Long>, LegendRepositoryCustom {
}
