package com.legendary_statistics.backend.dto.reroll;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetSynergyRes {
    private Long id;
    private String name;
    private String desc;
    private String path;
}
