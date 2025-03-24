package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.rate.RateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rate")
@RequiredArgsConstructor
public class RateController {

    private final ApiResponse response;

    private final RateService rateService;

    @GetMapping("/list")
    public ResponseEntity<?> getRateList() {
        return response.success(rateService.getRateList());
    }
}
