package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.dto.newLegend.PostVoteReq;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.newLegend.NewLegendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/new-legend")
@RequiredArgsConstructor
public class NewLegendController {

    private final ApiResponse response;
    private final NewLegendService newLegendService;

    @GetMapping("/list")
    public ResponseEntity<?> getNewLegendList() {
        return response.success(newLegendService.getNewLegendList());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getNewLegendDetail(@PathVariable Long id) {
        return response.success(newLegendService.getNewLegendDetail(id));
    }

    @PostMapping("/vote")
    public ResponseEntity<?> voteNewLegend(@RequestBody PostVoteReq request) {
        newLegendService.voteNewLegend(request);
        return response.success();
    }
}
