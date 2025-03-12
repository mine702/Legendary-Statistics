package com.legendary_statistics.backend.dto.legend;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetLegendListRes {
    private Long kindId;
    private String kindName;
    private Long rateId;
    private String name;
    private Boolean limited;
    private Boolean animation;
    private List<GetLegendRes> legends;
}
