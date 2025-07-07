package com.legendary_statistics.backend.dto.user;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordReq {
    @Pattern(regexp = "^[가-힣a-zA-Z]{2,8}$", message = "이름은 한글, 영문 2~8자리여야 합니다.")
    private String name;
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message = "이메일 형식이 올바르지 않습니다.")
    private String email;
}
