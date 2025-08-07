package com.legendary_statistics.backend.repository.newLegend.custom;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendCommentRes;

import java.util.List;

public interface NewLegendRepositoryCustom {

    List<GetNewLegendCommentRes> findCommentsByNewLegendId(Long id);
}
