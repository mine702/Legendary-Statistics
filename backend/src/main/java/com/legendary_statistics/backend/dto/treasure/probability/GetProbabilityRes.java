package com.legendary_statistics.backend.dto.treasure.probability;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetProbabilityRes {
    private Long id;
    private String name;
    private Double probability;
}
