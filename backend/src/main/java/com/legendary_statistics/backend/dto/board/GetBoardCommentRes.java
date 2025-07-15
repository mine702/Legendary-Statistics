package com.legendary_statistics.backend.dto.board;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class GetBoardCommentRes {
    long id;
    Long userId;
    String userName;
    String content;
    LocalDateTime createdAt;
}
