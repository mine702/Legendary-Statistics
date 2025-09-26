package com.legendary_statistics.backend.repository.legend.custom;

import com.legendary_statistics.backend.dto.legend.GetIdAndActualFileNameRes;
import com.legendary_statistics.backend.dto.legend.GetLegendListRes;
import com.legendary_statistics.backend.dto.legend.GetLegendRes;
import com.legendary_statistics.backend.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class LegendRepositoryCustomImpl implements LegendRepositoryCustom {
    private final JPAQueryFactory jpqlQuery;

    QLegendEntity legendEntity = QLegendEntity.legendEntity;
    QKindEntity kindEntity = QKindEntity.kindEntity;
    QRateEntity rateEntity = QRateEntity.rateEntity;
    QFileLegendEntity fileLegendEntity = QFileLegendEntity.fileLegendEntity;

    private Map<String, GetLegendListRes> getGetLegendListResMap(List<Tuple> fetch) {
        Map<String, GetLegendListRes> groupedMap = new LinkedHashMap<>();

        for (Tuple tuple : fetch) {
            Long kindId = tuple.get(kindEntity.id);
            String kindName = tuple.get(kindEntity.name);
            Long rateId = tuple.get(rateEntity.id);
            String name = tuple.get(legendEntity.name);
            Boolean limited = tuple.get(legendEntity.limited);
            Boolean animation = tuple.get(legendEntity.animation);

            String key = kindId + "-" + rateId + "-" + name;

            GetLegendListRes legendList = groupedMap.get(key);

            if (legendList == null) {
                legendList = new GetLegendListRes(kindId, kindName, rateId, name, limited, animation, new ArrayList<>());
                groupedMap.put(key, legendList);
            }

            GetLegendRes legendRes = new GetLegendRes(
                    tuple.get(legendEntity.id),
                    tuple.get(fileLegendEntity.actualFileName),
                    tuple.get(fileLegendEntity.path),
                    tuple.get(legendEntity.star),
                    tuple.get(legendEntity.createdAt),
                    tuple.get(legendEntity.deleted)
            );

            legendList.getLegends().add(legendRes);
        }
        return groupedMap;
    }

    @Override
    public List<GetLegendListRes> findLegendListByKind(KindEntity kind) {
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(legendEntity.kindEntity.eq(kind));

        List<Tuple> fetch = jpqlQuery.from(legendEntity)
                .where(builder)
                .leftJoin(legendEntity.rateEntity, rateEntity)
                .leftJoin(legendEntity.kindEntity, kindEntity)
                .leftJoin(legendEntity.fileLegendEntity, fileLegendEntity)
                .select(
                        kindEntity.id,
                        kindEntity.name,
                        rateEntity.id,
                        legendEntity.name,
                        legendEntity.limited,
                        legendEntity.animation,
                        legendEntity.id,
                        fileLegendEntity.actualFileName,
                        fileLegendEntity.path,
                        legendEntity.star,
                        legendEntity.createdAt,
                        legendEntity.deleted
                )
                .orderBy(legendEntity.rateEntity.id.asc(), legendEntity.name.asc(), legendEntity.star.asc())
                .fetch();

        Map<String, GetLegendListRes> groupedMap = getGetLegendListResMap(fetch);
        return new ArrayList<>(groupedMap.values());
    }

    @Override
    public List<GetIdAndActualFileNameRes> findAllLegendIdAndFileName(List<String> actualFileNames) {
        return jpqlQuery.from(legendEntity)
                .leftJoin(legendEntity.fileLegendEntity, fileLegendEntity)
                .where(fileLegendEntity.actualFileName.in(actualFileNames))
                .select(Projections.bean(
                        GetIdAndActualFileNameRes.class,
                        legendEntity.id,
                        fileLegendEntity.actualFileName,
                        legendEntity.name,
                        legendEntity.star
                ))
                .fetch();
    }

    @Override
    public List<GetLegendListRes> findLegendListLast() {
        LocalDateTime localDateTime = jpqlQuery.from(legendEntity)
                .select(legendEntity.createdAt)
                .orderBy(legendEntity.createdAt.desc())
                .fetchFirst();

        LocalDateTime start = Objects.requireNonNull(localDateTime).toLocalDate().atStartOfDay();

        List<Tuple> fetch = jpqlQuery.from(legendEntity)
                .where(legendEntity.createdAt.goe(start))
                .leftJoin(legendEntity.rateEntity, rateEntity)
                .leftJoin(legendEntity.kindEntity, kindEntity)
                .leftJoin(legendEntity.fileLegendEntity, fileLegendEntity)
                .select(kindEntity.id,
                        kindEntity.name,
                        rateEntity.id,
                        legendEntity.name,
                        legendEntity.limited,
                        legendEntity.animation,
                        legendEntity.id,
                        fileLegendEntity.actualFileName,
                        fileLegendEntity.path,
                        legendEntity.star,
                        legendEntity.createdAt,
                        legendEntity.deleted
                ).orderBy(legendEntity.rateEntity.id.asc(), legendEntity.name.asc(), legendEntity.star.asc())
                .fetch();

        Map<String, GetLegendListRes> groupedMap = getGetLegendListResMap(fetch);
        return new ArrayList<>(groupedMap.values());
    }
}
