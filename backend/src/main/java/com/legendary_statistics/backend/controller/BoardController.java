package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final ApiResponse response;
    private final BoardService boardService;

    @GetMapping("/list")
    public ResponseEntity<?> getBoardList(Pageable pageable, @RequestParam String category, @RequestParam(required = false) String keyword) {
        Page<GetBoardListRes> boardList = boardService.getBoardList(pageable, category, keyword);
        return response.pagination(boardList);
    }

}
