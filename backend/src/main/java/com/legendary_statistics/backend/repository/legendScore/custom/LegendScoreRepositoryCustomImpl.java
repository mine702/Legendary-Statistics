package com.legendary_statistics.backend.repository.legendScore.custom;

import com.legendary_statistics.backend.dto.ranking.GetRankingRes;
import com.legendary_statistics.backend.entity.QFileLegendEntity;
import com.legendary_statistics.backend.entity.QLegendEntity;
import com.legendary_statistics.backend.entity.QLegendScoreEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Repository
@RequiredArgsConstructor
public class LegendScoreRepositoryCustomImpl implements LegendScoreRepositoryCustom {

    private final JPAQueryFactory jpqlQuery;

    QLegendEntity qLegendEntity = QLegendEntity.legendEntity;
    QFileLegendEntity qFileLegendEntity = QFileLegendEntity.fileLegendEntity;
    QLegendScoreEntity qLegendScoreEntity = QLegendScoreEntity.legendScoreEntity;

    @Override
    public Page<GetRankingRes> findAllByLegend(Pageable pageable, Long kind, Boolean limit, Long rate, Integer year, String keyword) {
        BooleanExpression baseCondition = qLegendEntity.star.eq(1);

        if (kind != null)
            baseCondition = baseCondition.and(qLegendEntity.kindEntity.id.eq(kind));
        if (limit != null)
            baseCondition = baseCondition.and(qLegendEntity.limited.eq(limit));
        if (rate != null)
            baseCondition = baseCondition.and(qLegendEntity.rateEntity.id.eq(rate));

        // join condition
        BooleanExpression scoreJoinCondition = qLegendScoreEntity.legendEntity.id.eq(qLegendEntity.id);
        if (year != null)
            scoreJoinCondition = scoreJoinCondition.and(qLegendScoreEntity.year.eq(year));

        // score expression
        NumberExpression<Integer> scoreExpr = (year != null)
                ? qLegendScoreEntity.score.coalesce(0)
                : qLegendScoreEntity.score.sum().coalesce(0);

        if (keyword == null || keyword.isEmpty()) {
            List<GetRankingRes> result = jpqlQuery
                    .from(qLegendEntity)
                    .leftJoin(qLegendScoreEntity).on(scoreJoinCondition)
                    .leftJoin(qLegendEntity.fileLegendEntity, qFileLegendEntity)
                    .select(
                            Projections.bean(
                                    GetRankingRes.class,
                                    qLegendEntity.id,
                                    qLegendEntity.name,
                                    qFileLegendEntity.path,
                                    scoreExpr.as("score")
                            )
                    )
                    .where(baseCondition)
                    .groupBy(qLegendEntity.id, qFileLegendEntity.path, qLegendEntity.name)
                    .orderBy(scoreExpr.desc(), qLegendEntity.id.asc())
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();

            Long count = jpqlQuery
                    .select(qLegendEntity.count())
                    .from(qLegendEntity)
                    .where(baseCondition)
                    .fetchOne();

            long startRank = pageable.getOffset() + 1;
            for (int i = 0; i < result.size(); i++) {
                result.get(i).setRank((int) (startRank + i));
            }

            return new PageImpl<>(result, pageable, count != null ? count : 0L);
        } else {
            List<GetRankingRes> allList = jpqlQuery
                    .from(qLegendEntity)
                    .leftJoin(qLegendScoreEntity).on(scoreJoinCondition)
                    .leftJoin(qLegendEntity.fileLegendEntity, qFileLegendEntity)
                    .select(
                            Projections.bean(
                                    GetRankingRes.class,
                                    qLegendEntity.id,
                                    qLegendEntity.name,
                                    qFileLegendEntity.path,
                                    scoreExpr.as("score")
                            )
                    )
                    .where(baseCondition)
                    .groupBy(qLegendEntity.id, qFileLegendEntity.path, qLegendEntity.name)
                    .orderBy(scoreExpr.desc(), qLegendEntity.id.asc())
                    .fetch();

            // 순위 부여
            int rank = 1;
            for (GetRankingRes item : allList) {
                item.setRank(rank++);
            }

            // keyword로 필터링
            List<GetRankingRes> filtered = new ArrayList<>();
            String lowerKeyword = keyword.toLowerCase(Locale.ROOT);
            for (GetRankingRes item : allList) {
                if (item.getName().toLowerCase(Locale.ROOT).contains(lowerKeyword)) {
                    filtered.add(item);
                }
            }

            // 페이징 처리
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filtered.size());
            List<GetRankingRes> pagedList = filtered.subList(start, end);

            return new PageImpl<>(pagedList, pageable, filtered.size());
        }
    }
}
