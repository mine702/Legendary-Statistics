package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "board_file")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardFileEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "board_id", nullable = false)
    private BoardEntity boardEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "file_id", nullable = false)
    private FileEntity fileEntity;

    @Builder
    public BoardFileEntity(BoardEntity boardEntity, FileEntity fileEntity) {
        this.boardEntity = boardEntity;
        this.fileEntity = fileEntity;
    }
}
