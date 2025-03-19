package com.legendary_statistics.backend.dto.excel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetExcelLegendReq {
    private String name;
    private int star;
    private double probability;
}
