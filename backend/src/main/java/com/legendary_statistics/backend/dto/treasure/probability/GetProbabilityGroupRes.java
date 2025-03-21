package com.legendary_statistics.backend.dto.treasure.probability;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetProbabilityGroupRes {
    private Long id;
    private String name;
    private Double probability;
    private List<GetProbabilityRes> probabilityList;
}
