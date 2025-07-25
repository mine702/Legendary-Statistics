package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import com.legendary_statistics.backend.dto.board.PostBoardCommentReq;
import com.legendary_statistics.backend.dto.board.PostBoardReq;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.board.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final ApiResponse response;
    private final BoardService boardService;

    @GetMapping("/list")
    public ResponseEntity<?> getBoardList(Pageable pageable, @RequestParam String category, @RequestParam(required = false) String keyword) {
        return response.pagination(boardService.getBoardList(pageable, category, keyword));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getBoardCategories() {
        return response.success(boardService.getBoardCategories());
    }

    @PostMapping("/write")
    @PreAuthorize("authenticated")
    public void writeBoard(@Valid @RequestBody PostBoardReq postBoardReq, Principal principal) {
        boardService.writeBoard(postBoardReq, principal);
    }

    @PutMapping("/write")
    @PreAuthorize("authenticated")
    public void editBoard(@Valid @RequestBody PostBoardReq postBoardReq, Principal principal) {
        boardService.editBoard(postBoardReq, principal);
    }


    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getBoardDetail(@PathVariable Long id) {
        return response.success(boardService.getBoardDetail(id));
    }

    @GetMapping("last-time-inquiry")
    public ResponseEntity<?> getLastTimeInquiry() {
        return response.success(boardService.getLastTimeInquiry());
    }

    @GetMapping("comment/{boardId}")
    public ResponseEntity<?> getBoardComments(@PathVariable Long boardId) {
        return response.success(boardService.getBoardComments(boardId));
    }

    @PostMapping("comment")
    @PreAuthorize("authenticated")
    public void postBoardComment(@Valid @RequestBody PostBoardCommentReq postBoardCommentReq, Principal principal) {
        boardService.postBoardComment(postBoardCommentReq, principal);
    }

    @DeleteMapping("comment/{commentId}")
    @PreAuthorize("authenticated")
    public void deleteBoardComment(@PathVariable Long commentId, Principal principal) {
        boardService.deleteBoardComment(commentId, principal);
    }

    @DeleteMapping("{boardId}")
    @PreAuthorize("authenticated")
    public void deleteBoard(@PathVariable Long boardId, Principal principal) {
        boardService.deleteBoard(boardId, principal);
    }

    @GetMapping("my-list")
    @PreAuthorize("authenticated")
    public ResponseEntity<?> getMyBoardList(Pageable pageable, @RequestParam(required = false) String keyword, Principal principal) {
        Page<GetBoardListRes> myBoardList = boardService.getMyBoardList(pageable, keyword, principal);
        return response.pagination(myBoardList);
    }
}
