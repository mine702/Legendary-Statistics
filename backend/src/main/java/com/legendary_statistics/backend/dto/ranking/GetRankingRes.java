package com.legendary_statistics.backend.dto.ranking;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetRankingRes {
    private Long id;
    private String name;
    private String path;
    private int score;
    private int rank;
}
