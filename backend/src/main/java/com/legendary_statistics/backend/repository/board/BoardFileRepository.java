package com.legendary_statistics.backend.repository.board;

import com.legendary_statistics.backend.entity.BoardEntity;
import com.legendary_statistics.backend.entity.BoardFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardFileRepository extends JpaRepository<BoardFileEntity, Long> {
    List<BoardFileEntity> findAllByBoardEntity(BoardEntity boardEntity);
}
