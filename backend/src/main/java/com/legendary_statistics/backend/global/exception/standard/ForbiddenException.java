package com.legendary_statistics.backend.global.exception.standard;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

/**
 * (1.0) (403) 사용자가 로그인한 상태이지만 해당 자원에 접근할 권한이 없는 경우 사용되는 예외입니다.
 */
@Getter
public class ForbiddenException extends RuntimeException {
    private final ErrorCode errorCode;

    public ForbiddenException() {
        super(ErrorCode.FORBIDDEN.getMessage());
        this.errorCode = ErrorCode.FORBIDDEN;
    }
}
