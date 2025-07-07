package com.legendary_statistics.backend.global.exception.user;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {

    private final ErrorCode errorCode;

    public UserNotFoundException() {
        this.errorCode = ErrorCode.USER_NOT_FOUND;
    }
}
