package com.legendary_statistics.backend.global.exception.standard;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class DuplicationException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String clientMessage;

    public DuplicationException() {
        super(ErrorCode.DUPLICATION_ERROR.getMessage());
        this.errorCode = ErrorCode.DUPLICATION_ERROR;
        this.clientMessage = ErrorCode.DUPLICATION_ERROR.getMessage();
    }

    public DuplicationException(String clientMessage) {
        super(clientMessage);
        this.errorCode = ErrorCode.DUPLICATION_ERROR;
        this.clientMessage = clientMessage;
    }

}
