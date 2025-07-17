package com.legendary_statistics.backend.service.board;

import com.legendary_statistics.backend.dto.board.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public interface BoardService {
    Page<GetBoardListRes> getBoardList(Pageable pageable, String category, String keyword);

    List<GetBoardCategoryRes> getBoardCategories();

    void writeBoard(PostBoardReq postBoardReq, Principal principal);

    GetBoardRes getBoardDetail(Long id);

    Map<String, String> getLastTimeInquiry();

    List<GetBoardCommentRes> getBoardComments(Long boardId);

    void postBoardComment(PostBoardCommentReq postBoardCommentReq, Principal principal);

    void deleteBoardComment(Long commentId, Principal principal);

    void deleteBoard(Long boardId, Principal principal);

    Page<GetBoardListRes> getMyBoardList(Pageable pageable, String keyword, Principal principal);

    void editBoard(PostBoardReq postBoardReq, Principal principal);
}
