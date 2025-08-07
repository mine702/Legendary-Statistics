package com.legendary_statistics.backend.global.exception.certified;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class ReCaptchaException extends RuntimeException {
    private final ErrorCode errorCode;

    public ReCaptchaException() {
        super(ErrorCode.FILE_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.RECAPTCHA_ERROR;
    }
}
