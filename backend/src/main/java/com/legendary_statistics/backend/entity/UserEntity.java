package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.auth.config.JwtUserModel;
import com.legendary_statistics.backend.entity.enums.OperationLevelType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ClaimsBuilder;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class UserEntity implements JwtUserModel {
    @Enumerated(EnumType.STRING)
    @Column(name = "operation_level", nullable = false)
    private OperationLevelType operationLevel = OperationLevelType.USER;
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
        ClaimsBuilder claimsBuilder = Jwts.claims()
                .subject(Long.toString(id))
                .add("name", name)
                .add("email", email)
                .add("profilePictureFileId", profilePictureFileId);

        if (operationLevel.equals(OperationLevelType.ADMIN))
            claimsBuilder
                    .add("admin", true)
                    .add("user", true);
        
        if (operationLevel.equals(OperationLevelType.USER))
            claimsBuilder.add("user", true);

        return claimsBuilder.build();
    }

    @Override
    public Authentication getAuthentication(Jws<Claims> token) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        long id = Long.parseLong(token.getBody().getSubject());
        String name = (String) token.getBody().get("name");

        if (token.getPayload().containsKey("admin")) {
            authorities.add(new SimpleGrantedAuthority("admin"));
            authorities.add(new SimpleGrantedAuthority("user"));
        }

        if (token.getPayload().containsKey("user")) {
            authorities.add(new SimpleGrantedAuthority("user"));
        }

        return new JwtAuthentication(id, name, token, authorities);
    }
}
