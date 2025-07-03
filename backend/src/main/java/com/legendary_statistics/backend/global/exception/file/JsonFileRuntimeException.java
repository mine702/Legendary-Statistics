package com.legendary_statistics.backend.global.exception.file;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class JsonFileRuntimeException extends RuntimeException {
    private final ErrorCode errorCode;

    public JsonFileRuntimeException() {
        this.errorCode = ErrorCode.JSON_PARSE_ERROR;
    }
}
