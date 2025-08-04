# core/detect_thread.py
import os
import datetime
from PyQt5.QtCore import QThread, pyqtSignal
from PIL import Image as PILImage, Image
import numpy as np
import cv2
import requests
from sklearn.metrics.pairwise import cosine_similarity

from yt_dlp import YoutubeDL
from core.vector_utils import get_frame_vector
from core.image_cropper import simple_crop


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

        ydl_opts = {
            'format': 'best[height<=720][ext=mp4]',
            'outtmpl': self.video_path,
            'quiet': True,
            'no_warnings': True,
            'progress_hooks': [self.yt_log_hook]
        }

        try:
            self.log_signal.emit(f"🎬 유튜브 영상 다운로드 시작")
            with YoutubeDL(ydl_opts) as ydl:
                ydl.download([self.url])

            if not os.path.exists(self.video_path):
                self.log_signal.emit("❌ 영상 다운로드 실패")
                return

            self.log_signal.emit(f"✅ 다운로드 완료: {self.video_path}")
            self.detect_from_video(image_dir)

        except Exception as e:
            self.log_signal.emit(f"❌ 다운로드 중 오류 발생: {e}")

        finally:
            self.log_signal.emit("🔚 탐지 스레드 종료됨")

    def yt_log_hook(self, d):
        if d['status'] == 'downloading':
            downloaded = d.get('downloaded_bytes', 0)
            total = d.get('total_bytes', 0) or d.get('total_bytes_estimate', 0)
            percent = (downloaded / total * 100) if total else 0
            self.log_signal.emit(f"📥 다운로드 중... {percent:.2f}%")
        elif d['status'] == 'finished':
            self.log_signal.emit("✅ 다운로드 완료 처리 중...")

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
                frame_id += int(fps * 600)
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

        crop_imgs = [f for f in os.listdir(cropped_dir) if f.lower().endswith(".jpg")]
        self.log_signal.emit(f"🧠 전설 분석 시작 ({len(crop_imgs)}장)")

        labels_to_send = set()
        for i, fname in enumerate(crop_imgs, 1):
            try:
                img_path = os.path.join(cropped_dir, fname)
                img = Image.open(img_path).convert("RGB")
                vec = get_frame_vector(img)
                sims = cosine_similarity([vec], self.legend_vectors)[0]
                score = sims.max()
                if score >= 0.7:
                    labels_to_send.add(self.legend_labels[np.argmax(sims)])
            except Exception as e:
                self.log_signal.emit(f"❌ 분석 실패: {e}")

        self.log_signal.emit("✅ 전설 분석 완료")

        if labels_to_send:
            try:
                self.log_signal.emit(f"🌐 {len(labels_to_send)}개 라벨 전송 중...")
                response = requests.post(
                    "https://tftmeta.co.kr/api/ranking/set",
                    json=list(labels_to_send),
                    timeout=10
                )
                if response.status_code == 200:
                    self.log_signal.emit("✅ 전송 성공")
                else:
                    self.log_signal.emit(f"⚠️ 전송 실패: {response.status_code}")
            except Exception as e:
                self.log_signal.emit(f"💥 전송 중 오류 발생: {e}")
        else:
            self.log_signal.emit("ℹ️ 전송할 라벨 없음")

        try:
            if self.video_path and os.path.exists(self.video_path):
                os.remove(self.video_path)
                self.log_signal.emit(f"🗑️ 영상 파일 삭제됨: {self.video_path}")
        except Exception as e:
            self.log_signal.emit(f"⚠️ 영상 삭제 오류: {e}")
