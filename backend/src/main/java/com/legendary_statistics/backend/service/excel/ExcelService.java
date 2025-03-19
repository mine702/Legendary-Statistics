package com.legendary_statistics.backend.service.excel;

import com.legendary_statistics.backend.dto.excel.GetExcelLegendReq;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelService {
    public List<GetExcelLegendReq> readProbabilityExcelFile(MultipartFile file) {
        List<GetExcelLegendReq> legendList = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                String name = row.getCell(0).getStringCellValue();
                int star = (int) row.getCell(1).getNumericCellValue();
                double probability = row.getCell(2).getNumericCellValue();
                legendList.add(new GetExcelLegendReq(name, star, probability));
            }

        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return legendList;
    }
}
