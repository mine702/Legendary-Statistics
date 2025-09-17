package com.legendary_statistics.backend.repository.season;

import com.legendary_statistics.backend.entity.SeasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeasonRepository extends JpaRepository<SeasonEntity, Long> {
}
