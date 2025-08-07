package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.Treasure.TreasureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/treasure")
@RequiredArgsConstructor
public class TreasureController {

    private final ApiResponse response;
    private final TreasureService treasureService;

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getTreasure(@PathVariable Long id) {
        return response.success(treasureService.getTreasure(id));
    }

    @GetMapping("/probability/{id}")
    public ResponseEntity<?> getProbabilityByTreasureId(@PathVariable Long id) {
        return response.success(treasureService.getProbabilityByTreasureId(id));
    }

    @GetMapping("/list")
    public ResponseEntity<?> getTreasureList() {
        return response.success(treasureService.getTreasureList());
    }

    @GetMapping("/last")
    public ResponseEntity<?> getTreasureLast() {
        return response.success(treasureService.getTreasureLast());
    }

    @GetMapping("/simulator/{id}")
    public ResponseEntity<?> getSimulatorList(@PathVariable Long id) {
        return response.success(treasureService.getSimulatorList(id));
    }
}
