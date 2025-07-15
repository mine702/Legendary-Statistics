package com.legendary_statistics.backend.global.exception.kind;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class KindNotFoundException extends RuntimeException {

    private final ErrorCode errorCode;

    public KindNotFoundException() {
        super(ErrorCode.KIND_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.KIND_NOT_FOUND;
    }
}
