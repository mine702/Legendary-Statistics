package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "synergy")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SynergyEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "season_id")
    private SeasonEntity seasonEntity;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "desc", nullable = false)
    private String desc;
}
