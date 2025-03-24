package com.legendary_statistics.backend.service.rate;

import com.legendary_statistics.backend.dto.rate.GetRateRes;

import java.util.List;

public interface RateService {
    List<GetRateRes> getRateList();
}
