package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.Legend.LegendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/legend")
@RequiredArgsConstructor
public class LegendController {

    private final ApiResponse response;

    private final LegendService legendService;

    @GetMapping("/list/{id}")
    public ResponseEntity<?> getLegendListByKind(@PathVariable long id) {
        return response.success(legendService.getLegendListByKind(id));
    }

    
}
