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
public class CommunityDragonImageDownload {

    private static final String BASE_URL =
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/companions/";

    /**
     * PNG 파일들을 다운로드하고 다운로드된 파일명 리스트를 반환
     */
    public List<String> downloadAllImages(String fileUploadPath) throws Exception {
        Files.createDirectories(Path.of(fileUploadPath));

        Document doc = Jsoup.connect(BASE_URL).get();
        List<String> pngLinks = doc.select("a[href$=.png]")
                .stream()
                .map(a -> BASE_URL + a.attr("href"))
                .toList();

        log.info("총 {}개의 PNG 파일 발견. 다운로드 시작...", pngLinks.size());

        List<String> downloadedFiles = new ArrayList<>();
        ExecutorService executor = Executors.newFixedThreadPool(16);
        List<Future<?>> futures = new ArrayList<>();

        for (String link : pngLinks) {
            futures.add(executor.submit(() -> {
                String filename = downloadImage(fileUploadPath, link);
                if (filename != null) {
                    synchronized (downloadedFiles) {
                        downloadedFiles.add(filename);
                    }
                }
            }));
        }

        // 모든 스레드 완료 대기
        for (Future<?> future : futures) {
            future.get();
        }
        executor.shutdown();

        log.info("다운로드 완료. 총 {}개 파일 다운로드됨.", downloadedFiles.size());
        return downloadedFiles;
    }

    /**
     * 단일 이미지 다운로드
     * 이미 존재하는 파일은 건너뜀
     *
     * @param fileUrl URL
     * @return 다운로드된 파일명 (이미 있으면 null)
     */
    private String downloadImage(String fileUploadPath, String fileUrl) {
        try {
            String filename = new File(new URL(fileUrl).getPath()).getName();
            Path savePath = Path.of(fileUploadPath, filename);

            // 이미 존재하면 다운로드 스킵
            if (Files.exists(savePath)) {
                log.info("이미 존재: {}", filename);
                return null;
            }

            try (InputStream in = new URL(fileUrl).openStream();
                 FileOutputStream out = new FileOutputStream(savePath.toFile())) {
                in.transferTo(out);
            }

            log.info("다운로드 완료: {}", filename);
            return filename;
        } catch (Exception e) {
            log.error("오류: " + fileUrl + " - " + e.getMessage());
            return null;
        }
    }
}
