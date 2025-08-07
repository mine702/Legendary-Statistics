package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "new_legend_comment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NewLegendCommentEntity extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "new_legend_id", nullable = false)
    private NewLegendEntity newLegendEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Column(name = "content", nullable = false, length = 200)
    private String content;

    @Builder
    public NewLegendCommentEntity(NewLegendEntity newLegendEntity, UserEntity userEntity, String content) {
        this.newLegendEntity = newLegendEntity;
        this.userEntity = userEntity;
        this.content = content;
    }
}
