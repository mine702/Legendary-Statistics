package com.legendary_statistics.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/treasure")
@RequiredArgsConstructor
public class TreasureController {

    @GetMapping("/list")
    public String getTreasureList() {
        return "Treasure List";
    }
}
