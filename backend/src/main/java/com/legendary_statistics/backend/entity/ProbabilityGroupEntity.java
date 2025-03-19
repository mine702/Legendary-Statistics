package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "probability_group")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProbabilityGroupEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "treasure_id")
    private TreasureEntity treasureEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "rate_id")
    private RateEntity rateEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "probability", nullable = false)
    private Double probability;

    @OneToMany(mappedBy = "probabilityGroupEntity", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    private List<ProbabilityEntity> probabilityEntities;

    @Builder
    public ProbabilityGroupEntity(TreasureEntity treasureEntity, RateEntity rateEntity, String name, Double probability) {
        this.treasureEntity = treasureEntity;
        this.rateEntity = rateEntity;
        this.name = name;
        this.probability = probability;
    }
}
