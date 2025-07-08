package com.legendary_statistics.backend.repository.board.custom;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import com.legendary_statistics.backend.entity.QBoardCommentEntity;
import com.legendary_statistics.backend.entity.QBoardEntity;
import com.legendary_statistics.backend.entity.QUserEntity;
import com.legendary_statistics.backend.entity.enums.BoardCategoryType;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardRepositoryCustomImpl implements BoardRepositoryCustom {
    private final JPAQueryFactory jpqlQuery;

    QUserEntity userEntity = QUserEntity.userEntity;
    QBoardEntity boardEntity = QBoardEntity.boardEntity;
    QBoardCommentEntity boardCommentEntity = QBoardCommentEntity.boardCommentEntity;

    @Override
    public Page<GetBoardListRes> findAllByCategoryAndKeyword(PageRequest pageRequest, String category, String keyword) {

        BooleanExpression condition = boardEntity.category.eq(BoardCategoryType.fromApiName(category));

        if (keyword != null && !keyword.isEmpty()) {
            condition = condition.and(
                    boardEntity.title.containsIgnoreCase(keyword)
                            .or(boardEntity.content.containsIgnoreCase(keyword))
                            .or(boardEntity.userEntity.name.containsIgnoreCase(keyword))
            );
        }

        List<GetBoardListRes> result = jpqlQuery.from(boardEntity)
                .select(Projections.bean(
                        GetBoardListRes.class,
                        boardEntity.id,
                        boardEntity.userEntity.id.as("userId"),
                        boardEntity.userEntity.name.as("userName"),
                        boardEntity.title,
                        boardEntity.createdAt,
                        boardCommentEntity.count().as("commentCount")
                ))
                .leftJoin(boardEntity.comments, boardCommentEntity)
                .leftJoin(boardEntity.userEntity, userEntity)
                .where(condition)
                .groupBy(boardEntity.id)
                .orderBy(boardEntity.createdAt.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        Long count = jpqlQuery
                .select(boardEntity.count())
                .from(boardEntity)
                .where(condition)
                .fetchOne();

        return new PageImpl<>(result, pageRequest, count != null ? count : 0L);
    }
}
