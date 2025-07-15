package com.legendary_statistics.backend.repository.board;

import com.legendary_statistics.backend.entity.BoardCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardCommentEntity, Long> {
}
