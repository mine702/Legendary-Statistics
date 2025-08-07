package com.legendary_statistics.backend.dto.newLegend;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostNewLegendCommentReq {
    long id;
    @NotBlank(message = "댓글 내용을 입력해주세요.")
    String comment;
}
