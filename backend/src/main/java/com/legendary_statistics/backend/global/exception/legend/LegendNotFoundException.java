package com.legendary_statistics.backend.global.exception.legend;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class LegendNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public LegendNotFoundException() {
        this.errorCode = ErrorCode.LEGEND_NOT_FOUND;
    }
}
