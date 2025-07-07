package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.auth.service.AuthService;
import com.legendary_statistics.backend.dto.user.FindPasswordReq;
import com.legendary_statistics.backend.dto.user.SignUpByEmailReq;
import com.legendary_statistics.backend.service.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("authenticated")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/signup")
    @PreAuthorize("permitAll")
    public void signUp(@RequestBody @Valid SignUpByEmailReq req, HttpServletResponse response) {
        userService.signUp(req, response);
        authService.authByEmail(req.toAuthReq(), response);
    }

    @PostMapping("/find-password")
    @PreAuthorize("permitAll")
    public void findPassword(@RequestBody @Valid FindPasswordReq req) throws MessagingException, UnsupportedEncodingException {
        userService.findPassword(req);
    }

}
