package com.legendary_statistics.backend.dto.newLegend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostVoteReq {
    private Long id;
    private String type;
    private String token;
}
