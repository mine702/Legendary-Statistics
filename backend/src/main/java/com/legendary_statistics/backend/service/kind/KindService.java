package com.legendary_statistics.backend.service.kind;

import com.legendary_statistics.backend.dto.kind.GetKindRes;

import java.util.List;

public interface KindService {
    List<GetKindRes> getKindList();
}
