package com.legendary_statistics.backend.service.newLegend;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes;
import com.legendary_statistics.backend.dto.newLegend.GetNewLegendRes;
import com.legendary_statistics.backend.entity.NewLegendEntity;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.repository.newLegend.NewLegendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NewLegendServiceImpl implements NewLegendService {

    private final NewLegendRepository newLegendRepository;

    @Override
    public List<GetNewLegendListRes> getNewLegendList() {
        return newLegendRepository.findAllNamesOrderByCreatedAt();
    }

    @Override
    public GetNewLegendRes getNewLegendDetail(Long id) {
        NewLegendEntity newLegendEntity = newLegendRepository.findById(id).orElseThrow(LegendNotFoundException::new);

        GetNewLegendRes newLegendRes = new GetNewLegendRes();

        newLegendRes.setId(newLegendEntity.getId());
        newLegendRes.setName(newLegendEntity.getName());
        newLegendRes.setRateId(newLegendEntity.getRateEntity().getId());
        newLegendRes.setPrice(newLegendEntity.getPrice());
        newLegendRes.setVideoUrl(newLegendEntity.getVideoUrl());
        newLegendRes.setGood(newLegendEntity.getGood());
        newLegendRes.setBad(newLegendEntity.getBad());
        newLegendRes.setCreatedAt(newLegendEntity.getCreatedAt());
        
        return newLegendRes;
    }
}
