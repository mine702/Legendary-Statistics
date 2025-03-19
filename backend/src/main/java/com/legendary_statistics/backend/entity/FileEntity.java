package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "file")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileEntity extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actual_file_name", nullable = false)
    private String actualFileName;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "size", nullable = false)
    private Integer size;

    @Builder
    public FileEntity(String actualFileName, String path, Integer size) {
        this.actualFileName = actualFileName;
        this.path = path;
        this.size = size;
    }
}
