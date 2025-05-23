package com.legendary_statistics.backend.global.exception.probabilityGroup;

import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class ProbabilityGroupNotFoundException extends RuntimeException {
    private final ErrorCode errorCode;

    public ProbabilityGroupNotFoundException() {
        this.errorCode = ErrorCode.LEGEND_NOT_FOUND;
    }
}
