package com.legendary_statistics.backend.repository.board.custom;

import com.legendary_statistics.backend.dto.board.GetBoardCommentRes;
import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import com.legendary_statistics.backend.entity.QBoardCommentEntity;
import com.legendary_statistics.backend.entity.QBoardEntity;
import com.legendary_statistics.backend.entity.QUserEntity;
import com.legendary_statistics.backend.entity.enums.BoardCategoryType;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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

    @Override
    public Map<String, String> findAllLastBoardByCategory() {
        List<Tuple> documentTime = jpqlQuery
                .select(boardEntity.createdAt.max(), boardEntity.category)
                .from(boardEntity)
                .groupBy(boardEntity.category)
                .fetch();

        return documentTime.stream()
                .filter(tuple -> tuple.get(boardEntity.category) != null)
                .collect(Collectors.toMap(
                        tuple -> Objects.requireNonNull(tuple.get(boardEntity.category)).getDisplayName(),
                        tuple -> {
                            LocalDateTime createdAt = tuple.get(0, LocalDateTime.class);
                            return createdAt != null ? createdAt.toString() : "";
                        }
                ));
    }


    @Override
    public List<GetBoardCommentRes> findCommentsByBoardId(Long boardId) {
        return jpqlQuery.from(boardCommentEntity)
                .select(Projections.bean(
                        GetBoardCommentRes.class,
                        boardCommentEntity.id,
                        boardCommentEntity.userEntity.id.as("userId"),
                        boardCommentEntity.userEntity.name.as("userName"),
                        boardCommentEntity.content,
                        boardCommentEntity.createdAt
                ))
                .leftJoin(boardCommentEntity.userEntity, userEntity)
                .where(boardCommentEntity.boardEntity.id.eq(boardId))
                .orderBy(boardCommentEntity.createdAt.asc())
                .fetch();
    }

    @Override
    public Page<GetBoardListRes> findAllByUserIdAndKeyword(PageRequest pageRequest, long userId, String keyword) {

        BooleanExpression condition = boardEntity.userEntity.id.eq(userId);

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
