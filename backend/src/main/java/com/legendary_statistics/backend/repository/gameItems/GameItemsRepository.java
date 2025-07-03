package com.legendary_statistics.backend.repository.gameItems;

import com.legendary_statistics.backend.entity.GameItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameItemsRepository extends JpaRepository<GameItemsEntity, Long> {
    boolean existsByApiName(String apiName);
}
