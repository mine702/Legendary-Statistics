package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "legend")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LegendEntity extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "kind_id")
    private KindEntity kindEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "file_id")
    private FileEntity fileEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "rate_id")
    private RateEntity rateEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "star", nullable = false)
    private Integer star;

    @Column(name = "limited", nullable = false)
    private Boolean limited;

    @Column(name = "animation", nullable = false)
    private Boolean animation;

    @Builder
    public LegendEntity(KindEntity kindEntity, FileEntity fileEntity, RateEntity rateEntity, String name, Boolean limited, Boolean animation) {
        this.kindEntity = kindEntity;
        this.fileEntity = fileEntity;
        this.rateEntity = rateEntity;
        this.name = name;
        this.limited = limited;
        this.animation = animation;
    }
}
