package com.legendary_statistics.backend.service.gameItems;

import org.springframework.web.multipart.MultipartFile;

public interface GameItemsService {
    void filterCommunityDragonItemJson(MultipartFile file);
}
