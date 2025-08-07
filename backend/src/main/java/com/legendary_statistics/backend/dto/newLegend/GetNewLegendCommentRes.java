package com.legendary_statistics.backend.dto.newLegend;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class GetNewLegendCommentRes {
    long id;
    Long userId;
    String userName;
    String content;
    LocalDateTime createdAt;
}
