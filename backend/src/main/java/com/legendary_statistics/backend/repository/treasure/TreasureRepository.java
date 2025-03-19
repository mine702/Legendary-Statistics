package com.legendary_statistics.backend.repository.treasure;

import com.legendary_statistics.backend.entity.TreasureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreasureRepository extends JpaRepository<TreasureEntity, Long> {
    List<TreasureEntity> findByDeleted(boolean isDeleted);
}
