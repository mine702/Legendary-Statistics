package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.auth.service.AuthService;
import com.legendary_statistics.backend.dto.user.ChangeMyPasswordReq;
import com.legendary_statistics.backend.dto.user.FindPasswordReq;
import com.legendary_statistics.backend.dto.user.SignUpByEmailReq;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.service.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("authenticated")
public class UserController {

    private final UserService userService;
    private final AuthService authService;
    private final ApiResponse response;

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

    @GetMapping("/my-info")
    public ResponseEntity<?> getMyInfo(Principal principal) {
        return response.success(userService.getMyInfo(principal));
    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody @Valid ChangeMyPasswordReq req, Principal principal) {
        userService.changePassword(req, principal);
    }

    @DeleteMapping("/withdrawal")
    public void withdrawal(Principal principal) {
        userService.withdrawal(principal);
    }
}
