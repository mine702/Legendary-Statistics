package com.legendary_statistics.backend.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetBoardCategoryRes {
    private String name;
    private String label;
}
