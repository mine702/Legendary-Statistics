package com.legendary_statistics.backend.repository.probabilityGroup.custom;

import com.legendary_statistics.backend.dto.treasure.probability.GetProbabilityGroupRes;
import com.legendary_statistics.backend.dto.treasure.probability.GetProbabilityRes;
import com.legendary_statistics.backend.entity.QProbabilityEntity;
import com.legendary_statistics.backend.entity.QProbabilityGroupEntity;
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
public class ProbabilityGroupRepositoryCustomImpl implements ProbabilityGroupRepositoryCustom {

    private final JPAQueryFactory jpqlQuery;
    QProbabilityGroupEntity probabilityGroupEntity = QProbabilityGroupEntity.probabilityGroupEntity;
    QProbabilityEntity probabilityEntity = QProbabilityEntity.probabilityEntity;

    @Override
    public List<GetProbabilityGroupRes> getProbabilityGroupAndProbabilityByTreasureId(Long id) {

        List<Tuple> fetch = jpqlQuery.from(probabilityGroupEntity)
                .where(probabilityGroupEntity.treasureEntity.id.eq(id))
                .leftJoin(probabilityEntity)
                .on(probabilityEntity.probabilityGroupEntity.id.eq(probabilityGroupEntity.id))
                .select(
                        probabilityGroupEntity.id,
                        probabilityGroupEntity.name,
                        probabilityGroupEntity.probability,
                        probabilityEntity.id,
                        probabilityEntity.name,
                        probabilityEntity.probability
                )
                .fetch();

        // 결과를 담을 Map
        Map<Long, GetProbabilityGroupRes> groupMap = new LinkedHashMap<>();

        for (Tuple tuple : fetch) {
            Long groupId = tuple.get(probabilityGroupEntity.id);

            // 그룹이 없으면 새로 생성
            groupMap.computeIfAbsent(groupId, idKey -> GetProbabilityGroupRes.builder()
                    .id(idKey)
                    .name(tuple.get(probabilityGroupEntity.name))
                    .probability(tuple.get(probabilityGroupEntity.probability))
                    .probabilityList(new ArrayList<>())
                    .build());

            // 확률 데이터가 존재하면 리스트에 추가
            if (tuple.get(probabilityEntity.id) != null) {
                GetProbabilityRes prob = GetProbabilityRes.builder()
                        .id(tuple.get(probabilityEntity.id))
                        .name(tuple.get(probabilityEntity.name))
                        .probability(tuple.get(probabilityEntity.probability))
                        .build();

                groupMap.get(groupId).getProbabilityList().add(prob);
            }
        }

        return new ArrayList<>(groupMap.values());
    }

}
