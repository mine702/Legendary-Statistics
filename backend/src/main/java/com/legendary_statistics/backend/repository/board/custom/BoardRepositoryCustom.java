package com.legendary_statistics.backend.repository.board.custom;

import com.legendary_statistics.backend.dto.board.GetBoardCommentRes;
import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;

public interface BoardRepositoryCustom {

    Page<GetBoardListRes> findAllByCategoryAndKeyword(PageRequest pageRequest, String category, String keyword);

    Map<String, String> findAllLastBoardByCategory();

    List<GetBoardCommentRes> findCommentsByBoardId(Long boardId);

    Page<GetBoardListRes> findAllByUserIdAndKeyword(PageRequest pageRequest, long userId, String keyword);
}
