package com.legendary_statistics.backend.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetMyInfoRes {
    private long id;
    private String name;
    private String email;
}
