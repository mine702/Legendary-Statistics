package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.global.format.response.ResponseCode;
import com.legendary_statistics.backend.service.file.FileService;
import com.legendary_statistics.backend.service.gameItems.GameItemsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final ApiResponse response;
    private final GameItemsService gameItemsService;

    @GetMapping("/upload/legend")
    public void uploadLegend() {
        fileService.uploadLegend();
    }

    @GetMapping("/upload/kind")
    public void uploadKind() {
        fileService.uploadKind();
    }

    @PostMapping("/filter/CommunityDragon")
    public ResponseEntity<?> filterCommunityDragonJson(@RequestParam("file") MultipartFile file) {
        return response.success(ResponseCode.GET_JSON_SUCCESS, fileService.filterCommunityDragonJson(file));
    }

    @PostMapping("/filter/CommunityDragon/item")
    public void filterCommunityDragonItemJson(@RequestParam("file") MultipartFile file) {
        gameItemsService.filterCommunityDragonItemJson(file);
    }

    @ResponseBody
    @PostMapping("/upload/board")
    @PreAuthorize("authenticated")
    public ResponseEntity<?> uploadFilePublic(@RequestParam("file") MultipartFile file, Principal principal) throws IOException {
        return response.success(fileService.uploadFile(file, principal));
    }
}
