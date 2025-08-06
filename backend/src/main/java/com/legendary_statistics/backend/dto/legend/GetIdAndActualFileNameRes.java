package com.legendary_statistics.backend.dto.legend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetIdAndActualFileNameRes {
    private Long id;
    private String actualFileName;
    private String name;
    private Integer star;
}
