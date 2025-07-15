package com.legendary_statistics.backend.dto.board;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostBoardCommentReq {
    long boardId;
    @NotBlank(message = "댓글 내용을 입력해주세요.")
    String comment;
}
