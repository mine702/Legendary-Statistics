package com.legendary_statistics.backend.service.rate;

import com.legendary_statistics.backend.dto.rate.GetRateRes;
import com.legendary_statistics.backend.repository.rate.RateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RateServiceImpl implements RateService {
    private final RateRepository rateRepository;

    @Override
    public List<GetRateRes> getRateList() {
        return GetRateRes.of(rateRepository.findAll());
    }
}
