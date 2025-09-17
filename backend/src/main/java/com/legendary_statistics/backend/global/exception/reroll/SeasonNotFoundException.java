package com.legendary_statistics.backend.global.exception.reroll;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class SeasonNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public SeasonNotFoundException() {
        super(ErrorCode.SEASON_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.SEASON_NOT_FOUND;
    }
}
