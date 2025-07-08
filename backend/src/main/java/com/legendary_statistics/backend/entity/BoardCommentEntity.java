package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "board_comment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardCommentEntity extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "board_id", nullable = false)
    private BoardEntity boardEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Column(name = "content", nullable = false, length = 200)
    private String content;

    @Builder
    public BoardCommentEntity(BoardEntity boardEntity, UserEntity userEntity, String content) {
        this.boardEntity = boardEntity;
        this.userEntity = userEntity;
        this.content = content;
    }
}
