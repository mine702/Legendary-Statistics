package com.legendary_statistics.backend.repository.legend.custom;

import com.legendary_statistics.backend.dto.legend.GetLegendListRes;
import com.legendary_statistics.backend.dto.legend.GetLegendRes;
import com.legendary_statistics.backend.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class LegendRepositoryCustomImpl implements LegendRepositoryCustom {
    private final JPAQueryFactory jpqlQuery;

    QLegendEntity legendEntity = QLegendEntity.legendEntity;
    QKindEntity kindEntity = QKindEntity.kindEntity;
    QRateEntity rateEntity = QRateEntity.rateEntity;
    QFileEntity fileEntity = QFileEntity.fileEntity;

    @Override
    public List<GetLegendListRes> findLegendListByKind(KindEntity kind) {
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(legendEntity.kindEntity.eq(kind));

        List<Tuple> fetch = jpqlQuery.from(legendEntity)
                .where(builder)
                .leftJoin(legendEntity.rateEntity, rateEntity)
                .leftJoin(legendEntity.kindEntity, kindEntity)
                .leftJoin(legendEntity.fileEntity, fileEntity)
                .select(
                        kindEntity.id,
                        kindEntity.name,
                        rateEntity.id,
                        legendEntity.name,
                        legendEntity.limited,
                        legendEntity.animation,
                        legendEntity.id,
                        fileEntity.actualFileName,
                        fileEntity.path,
                        legendEntity.star,
                        legendEntity.createdAt,
                        legendEntity.deleted
                )
                .fetch();

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
                    tuple.get(fileEntity.actualFileName),
                    tuple.get(fileEntity.path),
                    tuple.get(legendEntity.star),
                    tuple.get(legendEntity.createdAt),
                    tuple.get(legendEntity.deleted)
            );

            legendList.getLegends().add(legendRes);
        }
        return new ArrayList<>(groupedMap.values());
    }
}
