package com.legendary_statistics.backend.controller;

import com.legendary_statistics.backend.dto.excel.GetExcelLegendReq;
import com.legendary_statistics.backend.service.excel.ExcelService;
import com.legendary_statistics.backend.service.probability.ProbabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/excel")
@RequiredArgsConstructor
public class ExcelController {

    private final ExcelService excelService;
    private final ProbabilityService probabilityService;

    @PostMapping("/upload/probability")
    public void uploadExcelProbability(@RequestParam("file") MultipartFile file,
                                       @RequestParam Long treasureId) {
        List<GetExcelLegendReq> getExcelLegendReqs = excelService.readProbabilityExcelFile(file);
        probabilityService.saveProbabilityExcelData(getExcelLegendReqs, treasureId);
    }
}
