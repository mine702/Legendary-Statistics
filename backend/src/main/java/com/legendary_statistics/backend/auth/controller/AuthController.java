package com.legendary_statistics.backend.auth.controller;

import com.legendary_statistics.backend.auth.module.AuthReq;
import com.legendary_statistics.backend.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/api/auth")
    public void auth(@RequestBody @Valid AuthReq authReq, HttpServletResponse response, HttpServletRequest request) {
        authService.authByEmail(authReq, response, request);
    }
}
