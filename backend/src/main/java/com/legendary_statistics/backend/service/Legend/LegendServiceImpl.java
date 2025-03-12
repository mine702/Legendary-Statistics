package com.legendary_statistics.backend.service.Legend;

import com.legendary_statistics.backend.dto.legend.GetLegendListRes;
import com.legendary_statistics.backend.entity.KindEntity;
import com.legendary_statistics.backend.global.exception.kind.KindNotFoundException;
import com.legendary_statistics.backend.repository.kind.KindRepository;
import com.legendary_statistics.backend.repository.legend.LegendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LegendServiceImpl implements LegendService {

    private final LegendRepository legendRepository;
    private final KindRepository kindRepository;

    @Override
    public List<GetLegendListRes> getLegendListByKind(long id) {
        KindEntity kind = kindRepository.findById(id).orElseThrow(KindNotFoundException::new);
        return legendRepository.findLegendListByKind(kind);
    }
}
