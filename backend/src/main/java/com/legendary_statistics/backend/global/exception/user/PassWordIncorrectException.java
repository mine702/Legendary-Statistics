package com.legendary_statistics.backend.global.exception.user;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class PassWordIncorrectException extends RuntimeException {
    private final ErrorCode errorCode;

    public PassWordIncorrectException() {
        this.errorCode = ErrorCode.PASS_WORD_INCORRECT;
    }
}
