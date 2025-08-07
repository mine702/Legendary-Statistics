package com.legendary_statistics.backend.repository.newLegend.custom;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendCommentRes;
import com.legendary_statistics.backend.entity.QNewLegendCommentEntity;
import com.legendary_statistics.backend.entity.QNewLegendEntity;
import com.legendary_statistics.backend.entity.QUserEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class NewLegendRepositoryCustomImpl implements NewLegendRepositoryCustom {

    private final JPAQueryFactory jpqlQuery;

    QNewLegendEntity newLegendEntity = QNewLegendEntity.newLegendEntity;
    QNewLegendCommentEntity newLegendCommentEntity = QNewLegendCommentEntity.newLegendCommentEntity;
    QUserEntity userEntity = QUserEntity.userEntity;

    @Override
    public List<GetNewLegendCommentRes> findCommentsByNewLegendId(Long id) {
        return jpqlQuery.from(newLegendCommentEntity)
                .select(Projections.bean(
                        GetNewLegendCommentRes.class,
                        newLegendCommentEntity.id,
                        newLegendCommentEntity.userEntity.id.as("userId"),
                        newLegendCommentEntity.userEntity.name.as("userName"),
                        newLegendCommentEntity.content,
                        newLegendCommentEntity.createdAt
                ))
                .leftJoin(newLegendCommentEntity.userEntity, userEntity)
                .where(newLegendCommentEntity.newLegendEntity.id.eq(id))
                .orderBy(newLegendCommentEntity.createdAt.asc())
                .fetch();
    }
}
