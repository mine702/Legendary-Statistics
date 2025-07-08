package com.legendary_statistics.backend.repository.board;

import com.legendary_statistics.backend.entity.BoardEntity;
import com.legendary_statistics.backend.repository.board.custom.BoardRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long>, BoardRepositoryCustom {
}
