package com.legendary_statistics.backend.repository.token;

import com.legendary_statistics.backend.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<TokenEntity, Long> {
    Optional<TokenEntity> findByUserIdAndRefreshToken(long userId, String refreshToken);

    List<TokenEntity> findByUserIdAndExpireDateBefore(long userId, LocalDateTime now);

    @Transactional
    void deleteByExpireDateBefore(LocalDateTime now);
}
