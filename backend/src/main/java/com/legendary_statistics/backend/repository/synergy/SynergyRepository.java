package com.legendary_statistics.backend.repository.synergy;

import com.legendary_statistics.backend.entity.SeasonEntity;
import com.legendary_statistics.backend.entity.SynergyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SynergyRepository extends JpaRepository<SynergyEntity, Long> {
    List<SynergyEntity> findBySeasonEntity(SeasonEntity seasonEntity);
}
