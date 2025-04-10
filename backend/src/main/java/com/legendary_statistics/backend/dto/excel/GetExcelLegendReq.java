package com.legendary_statistics.backend.dto.excel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class GetExcelLegendReq {
    private String name;
    private int star;
    private double probability;
}
