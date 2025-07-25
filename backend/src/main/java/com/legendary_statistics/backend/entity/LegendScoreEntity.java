package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "legend_score")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LegendScoreEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "legend_id")
    private LegendEntity legendEntity;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Builder
    public LegendScoreEntity(LegendEntity legendEntity, Integer year, Integer score) {
        this.legendEntity = legendEntity;
        this.year = year;
        this.score = score;
    }
}
