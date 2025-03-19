package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "kind")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KindEntity extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "file_id")
    private FileEntity fileEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Builder
    public KindEntity(FileEntity fileEntity, String name) {
        this.fileEntity = fileEntity;
        this.name = name;
    }
}
