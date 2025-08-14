package com.legendary_statistics.backend.global;

import com.legendary_statistics.backend.service.ranking.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AutomaticRanking {

    private final RankingService rankingService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReadyEvent() {
        rankingService.initScore();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void ranking() {
        rankingService.setRandomScore();
    }
}
