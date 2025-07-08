package com.legendary_statistics.backend.entity.enums;

public enum BoardCategoryType {
    NOTICE,
    LEGEND,
    FREE;

    public static BoardCategoryType fromApiName(String apiName) {
        if (apiName != null) {
            String lower = apiName.toLowerCase();
            if (lower.contains("notice")) return NOTICE;
            if (lower.contains("legend")) return LEGEND;
        }
        return FREE;
    }
}
