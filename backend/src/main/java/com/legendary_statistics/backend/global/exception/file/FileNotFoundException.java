package com.legendary_statistics.backend.global.exception.file;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class FileNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public FileNotFoundException() {
        super(ErrorCode.FILE_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.FILE_NOT_FOUND;
    }
}