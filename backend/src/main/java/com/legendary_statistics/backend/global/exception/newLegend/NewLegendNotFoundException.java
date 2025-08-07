package com.legendary_statistics.backend.global.exception.newLegend;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class NewLegendNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public NewLegendNotFoundException() {
        super(ErrorCode.NEW_LEGEND_NOT_FOUND.getMessage());
        this.errorCode = ErrorCode.NEW_LEGEND_NOT_FOUND;
    }
}
