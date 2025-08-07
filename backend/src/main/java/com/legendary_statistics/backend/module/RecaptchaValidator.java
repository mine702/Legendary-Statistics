package com.legendary_statistics.backend.module;

import com.legendary_statistics.backend.config.ReCaptchaConfigure;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecaptchaValidator {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ReCaptchaConfigure configure;

    public boolean verifyToken(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", configure.getSecretKey());
        params.add("response", token);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, params, Map.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                return false;
            }

            Map body = response.getBody();
            if (body == null || !Boolean.TRUE.equals(body.get("success"))) {
                return false;
            }

            Object scoreObj = body.get("score");
            if (scoreObj instanceof Number) {
                double score = ((Number) scoreObj).doubleValue();
                return score >= 0.5;
            }

            return false;

        } catch (Exception e) {
            log.error("reCAPTCHA 인증 중 예외 발생: " + e.getMessage());
            return false;
        }
    }

}
