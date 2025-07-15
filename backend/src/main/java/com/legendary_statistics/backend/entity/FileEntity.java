package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "file")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    @Column(name = "actual_file_name", nullable = false)
    private String actualFileName;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "size", nullable = false)
    private Long size;

    @Column(name = "upload_at", nullable = false)
    private LocalDate uploadAt;

    @Builder
    public FileEntity(UserEntity userEntity, String actualFileName, String path, Long size, LocalDate uploadAt) {
        this.userEntity = userEntity;
        this.actualFileName = actualFileName;
        this.path = path;
        this.size = size;
        this.uploadAt = uploadAt;
    }
}
