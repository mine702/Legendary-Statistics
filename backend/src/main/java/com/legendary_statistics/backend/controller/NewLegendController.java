package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.newLegend.NewLegendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
