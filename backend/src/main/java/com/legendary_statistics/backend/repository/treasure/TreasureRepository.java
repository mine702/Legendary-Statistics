package com.legendary_statistics.backend.repository.treasure;

import com.legendary_statistics.backend.entity.TreasureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreasureRepository extends JpaRepository<TreasureEntity, Long> {
}
