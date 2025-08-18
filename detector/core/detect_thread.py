import os
import sys
import datetime
import subprocess
import ctypes
from PyQt5.QtCore import QThread, pyqtSignal
from PIL import Image as PILImage
import cv2
from sklearn.metrics.pairwise import cosine_similarity

from core.vector_utils import get_frame_vector
from core.image_cropper import simple_crop
from core.legend_analyzer import analyze_legends

class DownloadAndDetectThread(QThread):
    log_signal = pyqtSignal(str)

    def __init__(self, url, ref_vectors, legend_vectors, legend_labels, save_dir):
        super().__init__()
        self.url = url
        self.ref_vectors = ref_vectors
        self.legend_vectors = legend_vectors
        self.legend_labels = legend_labels
        self.save_dir = save_dir
        self._is_running = True
        self.video_path = None

    def stop(self):
        self._is_running = False

    def run(self):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M")
        video_filename = f"video_{timestamp}.mp4"

        video_dir = os.path.join(self.save_dir, "downloaded_video")
        image_dir = os.path.join(self.save_dir, "image")

        os.makedirs(video_dir, exist_ok=True)
        os.makedirs(image_dir, exist_ok=True)

        self.video_path = os.path.join(video_dir, video_filename)

        yt_dlp_path = os.path.join(os.path.dirname(sys.executable), "yt-dlp.exe")

        cmd = [
            yt_dlp_path,
            "-f", "bestvideo[ext=mp4][height<=1080]",
            "--concurrent-fragments", "32",
            "--http-chunk-size", "32M",
            "--retries", "20",
            "--fragment-retries", "20",
            "-o", self.video_path,
            self.url
        ]

        try:
            self.log_signal.emit(f"🎬 유튜브 영상 다운로드 시작")
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                encoding="utf-8",
                creationflags=subprocess.CREATE_NO_WINDOW
            )
            for line in process.stdout:
                if not self._is_running:
                    self.log_signal.emit("🛑 다운로드 중단됨")
                    process.terminate()
                    return
                self.log_signal.emit(line.strip())
            process.wait()

            if not os.path.exists(self.video_path):
                self.log_signal.emit("❌ 영상 다운로드 실패")
                return

            self.log_signal.emit(f"✅ 다운로드 완료: {self.video_path}")
            self.detect_from_video(image_dir)

        except Exception as e:
            self.log_signal.emit(f"❌ 다운로드 중 오류 발생: {e}")

        finally:
            self.log_signal.emit("🔚 탐지 스레드 종료됨")

    def detect_from_video(self, save_dir):
        self.log_signal.emit("🔍 DINOv2로 탐지 시작")
        cap = cv2.VideoCapture(self.video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        interval = int(fps * 5)

        frame_id = 0
        saved = 0
        match_paths = []

        while frame_id < total_frames:
            if not self._is_running:
                self.log_signal.emit("🛑 측정 중단됨")
                break

            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
            ret, frame = cap.read()
            if not ret:
                break

            img = PILImage.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            vec = get_frame_vector(img)
            sim = cosine_similarity([vec], self.ref_vectors)[0].max()

            if sim >= 0.9:
                filename = f"match_{frame_id}_{sim:.3f}.jpg"
                out_path = os.path.join(save_dir, filename)
                img.save(out_path)
                match_paths.append(out_path)
                self.log_signal.emit(f"✅ 저장됨: {filename} (유사도: {sim:.3f})")
                saved += 1
                frame_id += int(fps * 900)
                continue

            frame_id += interval

        cap.release()
        self.log_signal.emit(f"🎉 탐지 완료, 총 {saved}개 저장됨")

        cropped_dir = os.path.join(save_dir, f"cropped_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}")
        os.makedirs(cropped_dir, exist_ok=True)

        self.log_signal.emit("✂️ 자르기 시작")
        for i, path in enumerate(match_paths, 1):
            try:
                cnt = simple_crop(path, cropped_dir)
                self.log_signal.emit(f"✅ ({i}/{len(match_paths)}) {os.path.basename(path)} → {cnt}조각")
            except Exception as e:
                self.log_signal.emit(f"❌ 자르기 실패: {e}")

        analyze_legends(cropped_dir, self.legend_vectors, self.legend_labels, log_fn=self.log_signal.emit)

        try:
            if self.video_path and os.path.exists(self.video_path):
                os.remove(self.video_path)
                self.log_signal.emit(f"🗑️ 영상 파일 삭제됨: {self.video_path}")
        except Exception as e:
            self.log_signal.emit(f"⚠️ 영상 삭제 오류: {e}")
