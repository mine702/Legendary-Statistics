package com.legendary_statistics.backend.dto.board;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostBoardReq {
    Long id;
    @NotBlank(message = "제목을 입력하세요.")
    String title;
    @NotBlank(message = "내용을 입력하세요.")
    String content;
    @NotBlank(message = "카테고리를 입력하세요.")
    String category;
    List<Long> fileIds;
}
