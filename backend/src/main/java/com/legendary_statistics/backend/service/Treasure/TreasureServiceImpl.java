package com.legendary_statistics.backend.service.Treasure;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TreasureServiceImpl implements TreasureService {
}
