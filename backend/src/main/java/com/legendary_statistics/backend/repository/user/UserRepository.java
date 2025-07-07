package com.legendary_statistics.backend.repository.user;

import com.legendary_statistics.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByEmailAndName(String email, String name);

    boolean existsByEmail(String email);
}
