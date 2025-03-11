package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.service.LegendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/legend")
@RequiredArgsConstructor
public class LegendController {
    private final LegendService legendService;


}
