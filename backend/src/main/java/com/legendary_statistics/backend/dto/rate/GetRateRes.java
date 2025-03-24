package com.legendary_statistics.backend.dto.rate;

import com.legendary_statistics.backend.entity.RateEntity;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetRateRes {
    private Long id;
    private String name;

    public static GetRateRes of(RateEntity rate) {
        return GetRateRes.builder()
                .id(rate.getId())
                .name(rate.getName())
                .build();
    }

    public static List<GetRateRes> of(List<RateEntity> rateEntities) {
        return rateEntities.stream()
                .map(GetRateRes::of)
                .collect(Collectors.toList());
    }
}
