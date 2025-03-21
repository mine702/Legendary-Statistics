package com.legendary_statistics.backend.repository.probabilityGroup;

import com.legendary_statistics.backend.entity.ProbabilityGroupEntity;
import com.legendary_statistics.backend.entity.RateEntity;
import com.legendary_statistics.backend.entity.TreasureEntity;
import com.legendary_statistics.backend.repository.probabilityGroup.custom.ProbabilityGroupRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProbabilityGroupRepository extends JpaRepository<ProbabilityGroupEntity, Long>, ProbabilityGroupRepositoryCustom {
    List<ProbabilityGroupEntity> findByTreasureEntity(TreasureEntity treasureEntity);

    Optional<ProbabilityGroupEntity> findByRateEntity(RateEntity rateEntity);
}
