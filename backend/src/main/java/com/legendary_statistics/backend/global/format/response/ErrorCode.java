package com.legendary_statistics.backend.global.format.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 글로벌 예외 처리
    GLOBAL_UNEXPECTED_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "처리 중 예기치 않은 서버 오류가 발생했습니다."),
    KIND_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 종류를 찾을 수 없습니다."),
    TREASURE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 보물을 찾을 수 없습니다."),
    LEGEND_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 전설이를 찾을 수 없습니다."),
    ;

    private final HttpStatus status;
    private final String message;
}
