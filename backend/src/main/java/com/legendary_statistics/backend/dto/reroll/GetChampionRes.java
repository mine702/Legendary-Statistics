package com.legendary_statistics.backend.dto.reroll;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class GetChampionRes {
    private Long id;
    private Integer cost;
    private String name;
    private String path;
    private String squarePath;
    private String mobilePath;
    private List<Long> synergyList;
}
