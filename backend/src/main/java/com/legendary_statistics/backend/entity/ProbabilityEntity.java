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
    @JoinColumn(name = "probability_group_id")
    private ProbabilityGroupEntity probabilityGroupEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "legend_id")
    private LegendEntity legendEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "currency_id")
    private CurrencyEntity currencyEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "probability", nullable = false)
    private Double probability;

    @Builder
    public ProbabilityEntity(TreasureEntity treasureEntity, ProbabilityGroupEntity probabilityGroupEntity, LegendEntity legendEntity, CurrencyEntity currencyEntity, String name, Double probability) {
        this.treasureEntity = treasureEntity;
        this.probabilityGroupEntity = probabilityGroupEntity;
        this.legendEntity = legendEntity;
        this.currencyEntity = currencyEntity;
        this.name = name;
        this.probability = probability;
    }
}
