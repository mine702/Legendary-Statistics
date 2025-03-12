package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.global.format.response.ResponseCode;
import com.legendary_statistics.backend.service.kind.KindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kind")
@RequiredArgsConstructor
public class KindController {
    
    private final ApiResponse response;

    private final KindService kindService;

    @GetMapping("/list")
    public ResponseEntity<?> getKindList() {
        return response.success(ResponseCode.GET_LIST_SUCCESS, kindService.getKindList());
    }
}
