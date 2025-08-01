package com.legendary_statistics.backend.module;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Slf4j
public class CommunityDragonScreenImageDownload {

    private static final String BASE_URL =
            "https://raw.communitydragon.org/latest/game/assets/characters/";

    /**
     * 모든 pet 디렉토리의 loadscreen PNG 파일을 tooltip 이름으로 다운로드
     */
    public void downloadAllImages(String fileUploadPath) throws Exception {
        Files.createDirectories(Path.of(fileUploadPath));

        // 병렬 다운로드를 위한 스레드 풀 (최대 16개)
        ExecutorService executor = Executors.newFixedThreadPool(16);
        List<Future<?>> futures = new ArrayList<>();

        for (String petDir : PetDirectory.PET_DIRS) {
            String hudUrl = BASE_URL + petDir + "/hud/";
            Document doc = Jsoup.connect(hudUrl).get();

            List<String> pngLinks = doc.select("a[href$=.png]")
                    .stream()
                    .map(a -> a.attr("href"))
                    .filter(name -> name.startsWith("loadscreen"))  // loadscreen 파일만
                    .map(name -> hudUrl + name)                    // 전체 URL 완성
                    .toList();

            log.info("[{}] 총 {}개의 loadscreen PNG 파일 발견. 다운로드 시작...", petDir, pngLinks.size());

            for (String fileUrl : pngLinks) {
                String originalName = new File(new URL(fileUrl).getPath()).getName();
                String renamedName = originalName.replace("loadscreen_", "tooltip_");

                // 병렬 다운로드 작업 등록
                futures.add(executor.submit(() ->
                        downloadImage(fileUploadPath, fileUrl, renamedName)
                ));
            }
        }

        // 모든 다운로드 작업이 끝날 때까지 대기
        for (Future<?> future : futures) {
            future.get();
        }
        executor.shutdown();

        log.info("✅ 전체 다운로드 완료!");
    }

    /**
     * 단일 이미지 다운로드
     */
    private void downloadImage(String fileUploadPath, String fileUrl, String saveAs) {
        try {
            Path savePath = Path.of(fileUploadPath, saveAs);

            // 이미 존재하면 스킵
            if (Files.exists(savePath)) {
                log.info("이미 존재: {}", saveAs);
                return;
            }

            try (InputStream in = new URL(fileUrl).openStream();
                 FileOutputStream out = new FileOutputStream(savePath.toFile())) {
                in.transferTo(out);
            }

            log.info("다운로드 완료: {}", saveAs);
        } catch (Exception e) {
            log.error("오류: {} - {}", fileUrl, e.getMessage());
        }
    }
}
