package com.legendary_statistics.backend.dto.reroll;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetRerollProbabilityRes {
    private Integer level1;
    private Integer level2;
    private Integer level3;
    private Integer level4;
    private Integer level5;
}
