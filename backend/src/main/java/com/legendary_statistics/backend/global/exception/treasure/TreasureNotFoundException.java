package com.legendary_statistics.backend.global.exception.treasure;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class TreasureNotFoundException extends RuntimeException {

    private final ErrorCode errorCode;

    public TreasureNotFoundException() {
        super(ErrorCode.TREASURE_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.TREASURE_NOT_FOUND;
    }
}
