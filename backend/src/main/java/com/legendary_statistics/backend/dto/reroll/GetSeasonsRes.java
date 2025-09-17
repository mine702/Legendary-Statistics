package com.legendary_statistics.backend.dto.reroll;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class GetSeasonsRes {
    private Long id;
    private Integer seasonNo;
    private LocalDate startAt;
    private LocalDate endAt;
}
