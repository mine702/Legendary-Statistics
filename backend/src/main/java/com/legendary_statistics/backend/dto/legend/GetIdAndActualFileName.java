package com.legendary_statistics.backend.dto.legend;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GetIdAndActualFileName {
    private Long id;
    private String actualFileName;
    private String name;
    private Integer star;
}
