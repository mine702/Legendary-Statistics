package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.ranking.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;
    private final ApiResponse response;

    @GetMapping("/list")
    public ResponseEntity<?> getRanking(
            Pageable pageable,
            @RequestParam(required = false) Long kind,
            @RequestParam(required = false) Boolean limit,
            @RequestParam(required = false) Long rate,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String keyword) {
        return response.pagination(rankingService.getRanking(pageable, kind, limit, rate, year, keyword));
    }

    @PostMapping("/set")
    public void setScoreByLabels(@RequestBody List<String> labels) {
        rankingService.setScoreByLabels(labels);
    }
}
