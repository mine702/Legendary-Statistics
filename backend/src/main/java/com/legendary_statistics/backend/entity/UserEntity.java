package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.auth.JwtUserModel;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;

@Entity
@Getter
@Setter
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity implements JwtUserModel {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Override
    public Claims setupClaimsOnCreateToken() {
        return null;
    }

    @Override
    public Authentication getAuthentication(Jws<Claims> token) {
        return null;
    }
}
