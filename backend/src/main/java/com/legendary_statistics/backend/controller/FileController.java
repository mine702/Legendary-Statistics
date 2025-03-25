package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.service.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping("/upload/legend")
    public void uploadLegend() {
        fileService.uploadLegend();
    }

    @GetMapping("/upload/kind")
    public void uploadKind() {
        fileService.uploadKind();
    }
}
