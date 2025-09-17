package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "champion")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChampionEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "season_id")
    private SeasonEntity seasonEntity;

    @Column(name = "cost", nullable = false)
    private Integer cost;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "synergy_id_1")
    private SynergyEntity synergyEntity1;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "synergy_id_2")
    private SynergyEntity synergyEntity2;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "synergy_id_3")
    private SynergyEntity synergyEntity3;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "mobile_path", nullable = false)
    private String mobilePath;

    @Column(name = "not_sale", nullable = false)
    private Boolean notSale;
}
