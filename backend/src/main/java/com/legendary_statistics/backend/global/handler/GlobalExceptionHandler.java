package com.legendary_statistics.backend.global.handler;

import com.legendary_statistics.backend.global.exception.kind.KindNotFoundException;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final ApiResponse response;

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<?> handle(Exception e) {
        log.error("Exception = {}", e.getMessage());
        e.printStackTrace();
        return response.error(ErrorCode.GLOBAL_UNEXPECTED_ERROR);
    }

    @ExceptionHandler(KindNotFoundException.class)
    protected ResponseEntity<?> handle(KindNotFoundException e) {
        log.error("KindNotFoundException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }
}
