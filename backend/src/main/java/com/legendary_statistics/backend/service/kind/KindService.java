package com.legendary_statistics.backend.service.kind;

import com.legendary_statistics.backend.dto.kind.GetKindListRes;

import java.util.List;

public interface KindService {
    List<GetKindListRes> getKindList();
}
