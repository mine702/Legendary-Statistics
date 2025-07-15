package com.legendary_statistics.backend.entity.enums;

import lombok.Getter;

@Getter
public enum BoardCategoryType {
    NOTICE("공지사항"),
    LEGEND("신규 전설이"),
    FREE("자유게시판");

    private final String displayName;

    BoardCategoryType(String displayName) {
        this.displayName = displayName;
    }

    public static BoardCategoryType fromApiName(String apiName) {
        if (apiName != null) {
            String lower = apiName.toLowerCase();
            if (lower.contains("notice")) return NOTICE;
            if (lower.contains("legend")) return LEGEND;
        }
        return FREE;
    }
}
