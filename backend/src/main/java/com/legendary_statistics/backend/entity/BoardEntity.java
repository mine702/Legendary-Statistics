package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.entity.enums.BoardCategoryType;
import com.legendary_statistics.backend.global.entitiy.CommonBaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "board")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardEntity extends CommonBaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private BoardCategoryType category;

    @OneToMany(mappedBy = "boardEntity", fetch = FetchType.LAZY)
    private List<BoardCommentEntity> comments;
    
    @Builder
    public BoardEntity(UserEntity userEntity, String title, String content, BoardCategoryType category) {
        this.userEntity = userEntity;
        this.title = title;
        this.content = content;
        this.category = category;
    }
}
