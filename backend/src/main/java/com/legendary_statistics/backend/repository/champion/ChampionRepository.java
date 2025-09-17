package com.legendary_statistics.backend.repository.champion;

import com.legendary_statistics.backend.entity.ChampionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChampionRepository extends JpaRepository<ChampionEntity, Long> {
}
