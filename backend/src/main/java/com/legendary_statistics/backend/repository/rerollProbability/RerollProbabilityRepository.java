package com.legendary_statistics.backend.repository.rerollProbability;

import com.legendary_statistics.backend.entity.RerollProbabilityEntity;
import com.legendary_statistics.backend.entity.SeasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RerollProbabilityRepository extends JpaRepository<RerollProbabilityEntity, Long> {
    Optional<RerollProbabilityEntity> findBySeasonEntityAndUserLevel(SeasonEntity seasonEntity, Integer userLevel);
}
