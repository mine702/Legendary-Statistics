package com.legendary_statistics.backend.service.user;

import com.legendary_statistics.backend.dto.user.FindPasswordReq;
import com.legendary_statistics.backend.dto.user.SignUpByEmailReq;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

import java.io.UnsupportedEncodingException;

public interface UserService {
    void signUp(SignUpByEmailReq req, HttpServletResponse response);

    void findPassword(FindPasswordReq req) throws MessagingException, UnsupportedEncodingException;
}
