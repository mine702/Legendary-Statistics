package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.reroll.RerollServie;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reroll")
@RequiredArgsConstructor
public class RerollController {

    private final RerollServie rerollServie;
    private final ApiResponse response;

    @GetMapping("seasons")
    public ResponseEntity<?> getSeasons() {
        return response.success(rerollServie.getSeasons());
    }

    @GetMapping("probability/{seasonId}/{userLevel}")
    public ResponseEntity<?> getProbability(@PathVariable Long seasonId, @PathVariable Integer userLevel) {
        return response.success(rerollServie.getProbability(seasonId, userLevel));
    }

    @GetMapping("champion-list/{seasonId}")
    public ResponseEntity<?> getChampionList(@PathVariable Long seasonId) {
        return response.success(rerollServie.getChampionList(seasonId));
    }

    @GetMapping("synergy-list/{seasonId}")
    public ResponseEntity<?> getSynergyList(@PathVariable Long seasonId) {
        return response.success(rerollServie.getSynergyList(seasonId));
    }
}
