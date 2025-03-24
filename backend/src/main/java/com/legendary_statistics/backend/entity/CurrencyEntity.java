package com.legendary_statistics.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "currency")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrencyEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "file_id")
    private FileEntity fileEntity;

    @Column(name = "name", nullable = false)
    private String name;
}
