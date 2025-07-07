package com.legendary_statistics.backend.global.exception.standard;

import com.legendary_statistics.backend.global.format.response.ErrorCode;

/**
 * (1.0) (409) DB 등 ID가 중복되었을 때 사용되는 예외입니다.
 */
public class DuplicationException extends RuntimeException {
    private final ErrorCode errorCode;
    String clientMessage;

    /**
     * (409) DB 등 ID가 중복되었을 때 사용되는 예외입니다.
     * 기본 생성자는 기본 에러메시지를 사용합니다.
     */
    public DuplicationException() {
        this.errorCode = ErrorCode.DUPLICATION_ERROR;
    }

    /**
     * (409) DB 등 ID가 중복되었을 때 사용되는 예외입니다.
     *
     * @param clientMessage 클라이언트에게 전달할 메시지입니다.
     */
    public DuplicationException(String clientMessage) {
        this.errorCode = ErrorCode.DUPLICATION_ERROR;
        this.clientMessage = clientMessage;
    }
}
