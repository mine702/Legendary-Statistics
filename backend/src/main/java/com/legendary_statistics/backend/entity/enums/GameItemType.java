package com.legendary_statistics.backend.entity.enums;

public enum GameItemType {
    AUGMENT,
    ITEM,
    ETC;

    public static GameItemType fromApiName(String apiName) {
        if (apiName != null) {
            String lower = apiName.toLowerCase();
            if (lower.contains("augment")) return AUGMENT;
            if (lower.contains("item")) return ITEM;
        }
        return ETC;
    }
}
