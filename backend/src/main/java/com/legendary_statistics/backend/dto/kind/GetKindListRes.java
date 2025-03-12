package com.legendary_statistics.backend.dto.kind;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetKindListRes {
    private Long id;
    private String actualFileName;
    private String path;
    private String name;
    private Boolean isDeleted;
}
