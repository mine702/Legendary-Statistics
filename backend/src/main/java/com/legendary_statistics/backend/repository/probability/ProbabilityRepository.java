package com.legendary_statistics.backend.repository.probability;

import com.legendary_statistics.backend.entity.ProbabilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProbabilityRepository extends JpaRepository<ProbabilityEntity, Long> {
}
