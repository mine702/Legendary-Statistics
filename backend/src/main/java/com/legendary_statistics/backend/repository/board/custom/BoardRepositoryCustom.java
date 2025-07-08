package com.legendary_statistics.backend.repository.board.custom;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface BoardRepositoryCustom {

    Page<GetBoardListRes> findAllByCategoryAndKeyword(PageRequest pageRequest, String category, String keyword);
}
