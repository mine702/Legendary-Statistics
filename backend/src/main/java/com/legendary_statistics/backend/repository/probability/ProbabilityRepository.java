package com.legendary_statistics.backend.repository.probability;

import com.legendary_statistics.backend.entity.ProbabilityEntity;
import com.legendary_statistics.backend.entity.TreasureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProbabilityRepository extends JpaRepository<ProbabilityEntity, Long> {
    List<ProbabilityEntity> findByTreasureEntity(TreasureEntity treasureEntity);
}
