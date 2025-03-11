package com.legendary_statistics.backend.repository.kind;

import com.legendary_statistics.backend.entity.KindEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KindRepository extends JpaRepository<KindEntity, Long> {
}
