package com.legendary_statistics.backend.repository.newLegend;

import com.legendary_statistics.backend.entity.NewLegendCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewLegendCommentRepository extends JpaRepository<NewLegendCommentEntity, Long> {
}
