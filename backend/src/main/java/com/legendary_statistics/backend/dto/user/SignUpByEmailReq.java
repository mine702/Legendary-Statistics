package com.legendary_statistics.backend.dto.user;

import com.legendary_statistics.backend.auth.module.AuthReq;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpByEmailReq {
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message = "이메일 형식이 올바르지 않습니다.")
    private String email;
    @Pattern(regexp = "^[가-힣a-zA-Z]{2,8}$", message = "이름은 한글, 영문 2~8자리여야 합니다.")
    private String name;
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$", message = "비밀번호는 영문, 숫자를 포함한 8~16자리여야 합니다.")
    private String password;

    /**
     * 회원가입 요청을 인증 요청으로 변환합니다. 회원가입 즉시 인증처리도 같이 수행하기 위해 사용됩니다.
     */
    public AuthReq toAuthReq() {
        var authReq = new AuthReq();
        authReq.setEmail(email);
        authReq.setPassword(password);
        return authReq;
    }
}
