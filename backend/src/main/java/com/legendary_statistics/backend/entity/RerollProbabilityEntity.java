package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "reroll_probability")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RerollProbabilityEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "season_id")
    private SeasonEntity seasonEntity;

    @Column(name = "user_level", nullable = false)
    private Integer userLevel;
    @Column(name = "level_1", nullable = false)
    private Integer level1;
    @Column(name = "level_2", nullable = false)
    private Integer level2;
    @Column(name = "level_3", nullable = false)
    private Integer level3;
    @Column(name = "level_4", nullable = false)
    private Integer level4;
    @Column(name = "level_5", nullable = false)
    private Integer level5;
    @Column(name = "level_6", nullable = false)
    private Integer level6;
}
