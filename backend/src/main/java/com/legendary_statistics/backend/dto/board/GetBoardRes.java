package com.legendary_statistics.backend.dto.board;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class GetBoardRes {
    long id;
    Long userId;
    String userName;
    String title;
    String content;
    String category;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;
    List<GetFileRes> files;

    @Builder

    public GetBoardRes(long id, Long userId, String userName, String title, String content, String category, LocalDateTime createdAt, List<GetFileRes> files) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.title = title;
        this.content = content;
        this.category = category;
        this.createdAt = createdAt;
        this.files = files;
    }
}
