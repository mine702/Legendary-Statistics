package com.legendary_statistics.backend.service.board;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {
    Page<GetBoardListRes> getBoardList(Pageable pageable, String category, String keyword);
}
