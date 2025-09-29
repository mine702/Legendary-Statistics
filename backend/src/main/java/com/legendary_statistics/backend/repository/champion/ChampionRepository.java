package com.legendary_statistics.backend.repository.champion;

import com.legendary_statistics.backend.entity.ChampionEntity;
import com.legendary_statistics.backend.entity.SeasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChampionRepository extends JpaRepository<ChampionEntity, Long> {
    List<ChampionEntity> findBySeasonEntityAndNotSaleFalse(SeasonEntity seasonEntity);
}
