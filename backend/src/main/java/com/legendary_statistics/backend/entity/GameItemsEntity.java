package com.legendary_statistics.backend.entity;

import com.legendary_statistics.backend.entity.enums.GameItemType;
import com.legendary_statistics.backend.global.entitiy.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "game_items")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameItemsEntity extends BaseEntity {
    @Id
    @Column(name = "api_name")
    private String apiName;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_path")
    private String iconPath;

    @Column(name = "associated_traits", columnDefinition = "JSON")
    private String associatedTraits;

    @Column(name = "incompatible_traits", columnDefinition = "JSON")
    private String incompatibleTraits;

    @Column(name = "tags", columnDefinition = "JSON")
    private String tags;

    @Column(name = "composition", columnDefinition = "JSON")
    private String composition;

    @Column(name = "from_items", columnDefinition = "JSON")
    private String fromItems;

    @Column(name = "effects", columnDefinition = "JSON")
    private String effects;

    @Column(name = "is_unique")
    private Boolean isUnique;

    @Column(name = "internal_id")
    private String internalId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private GameItemType type;

    @Builder
    public GameItemsEntity(String apiName, String name, String description, String iconPath, String associatedTraits, String incompatibleTraits, String tags, String composition, String fromItems, String effects, Boolean isUnique, String internalId, GameItemType type) {
        this.apiName = apiName;
        this.name = name;
        this.description = description;
        this.iconPath = iconPath;
        this.associatedTraits = associatedTraits;
        this.incompatibleTraits = incompatibleTraits;
        this.tags = tags;
        this.composition = composition;
        this.fromItems = fromItems;
        this.effects = effects;
        this.isUnique = isUnique;
        this.internalId = internalId;
        this.type = type;
    }
}
