package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.auth.config.JwtUserModel;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class UserEntity implements JwtUserModel {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_picture_file_id")
    private Long profilePictureFileId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @Builder
    public UserEntity(Long profilePictureFileId, String email, String name, String password) {
        this.profilePictureFileId = profilePictureFileId;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    @Override
    public Claims setupClaimsOnCreateToken() {
        return Jwts.claims()
                .subject(Long.toString(id))
                .add("name", name)
                .add("email", email)
                .add("profilePictureFileId", profilePictureFileId).build();
    }

    @Override
    public Authentication getAuthentication(Jws<Claims> token) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        long id = Long.parseLong(token.getBody().getSubject());
        String name = (String) token.getBody().get("name");

        return new JwtAuthentication(id, name, token, authorities);
    }
}
