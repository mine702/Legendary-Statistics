package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "file_currency")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileCurrencyEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actual_file_name", nullable = false)
    private String actualFileName;

    @Column(name = "path", nullable = false)
    private String path;

    @Builder
    public FileCurrencyEntity(Long id, String actualFileName, String path) {
        this.id = id;
        this.actualFileName = actualFileName;
        this.path = path;
    }
}
