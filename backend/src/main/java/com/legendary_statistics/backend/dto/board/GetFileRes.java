package com.legendary_statistics.backend.dto.board;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetFileRes {
    private long id;
    private String actualFileName;
    private Long size;

    @Builder
    public GetFileRes(long id, String actualFileName, Long size) {
        this.id = id;
        this.actualFileName = actualFileName;
        this.size = size;
    }
}
