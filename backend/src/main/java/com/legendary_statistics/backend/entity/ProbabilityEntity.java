package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "probability")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProbabilityEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "treasure_id")
    private TreasureEntity treasureEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "legend_id")
    private LegendEntity legendEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "probability", nullable = false)
    private Double probability;

    @Builder
    public ProbabilityEntity(TreasureEntity treasureEntity, LegendEntity legendEntity, String name, Double probability) {
        this.treasureEntity = treasureEntity;
        this.legendEntity = legendEntity;
        this.name = name;
        this.probability = probability;
    }
}
