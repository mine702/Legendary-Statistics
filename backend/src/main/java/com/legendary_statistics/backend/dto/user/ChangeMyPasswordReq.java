package com.legendary_statistics.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeMyPasswordReq {
    @NotBlank(message = "현재 비밀번호를 입력해주세요.")
    String oldPassword;
    @NotBlank(message = "변경할 비밀번호를 입력해주세요.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$", message = "비밀번호는 영문, 숫자를 포함한 8~16자리여야 합니다.")
    String newPassword;
}
