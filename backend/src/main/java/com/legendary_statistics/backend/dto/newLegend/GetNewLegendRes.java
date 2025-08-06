package com.legendary_statistics.backend.dto.newLegend;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class GetNewLegendRes {
    private Long id;
    private String name;
    private Long rateId;
    private Integer price;
    private String videoUrl;
    private Integer good;
    private Integer bad;
    private LocalDateTime createdAt;
}
