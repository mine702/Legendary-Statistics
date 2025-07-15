package com.legendary_statistics.backend.global.exception.board;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class BoardNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public BoardNotFoundException() {
        super(ErrorCode.BOARD_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.BOARD_NOT_FOUND;
    }
}
