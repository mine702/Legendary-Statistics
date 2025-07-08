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
    JSON_PARSE_ERROR(HttpStatus.BAD_REQUEST, "JSON 파싱 중 오류가 발생했습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다."),
    PASS_WORD_INCORRECT(HttpStatus.BAD_REQUEST, "비밀번호가 일치 하지 않습니다."),
    DUPLICATION_ERROR(HttpStatus.CONFLICT, "이미 존재하는 데이터입니다."),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "유효성 검사에 실패했습니다."),
    ;

    private final HttpStatus status;
    private final String message;
}
