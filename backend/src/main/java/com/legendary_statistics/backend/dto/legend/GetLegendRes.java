package com.legendary_statistics.backend.dto.legend;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetLegendRes {
    private Long id;
    private String actualFileName;
    private String path;
    private Integer star;
    private LocalDateTime createdAt;
    private Boolean deleted;
}
