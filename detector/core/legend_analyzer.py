# core/legend_analyzer.py
import os
import requests
import numpy as np
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
from core.vector_utils import get_frame_vector

def analyze_legends(cropped_dir, legend_vectors, legend_labels, log_fn=print):
    crop_imgs = [f for f in os.listdir(cropped_dir) if f.lower().endswith(".jpg")]
    log_fn(f"🧠 전설 분석 시작 ({len(crop_imgs)}장)")

    labels_to_send = []
    for i, fname in enumerate(crop_imgs, 1):
        try:
            img_path = os.path.join(cropped_dir, fname)
            img = Image.open(img_path).convert("RGB")
            vec = get_frame_vector(img)
            sims = cosine_similarity([vec], legend_vectors)[0]
            score = sims.max()
            if score >= 0.7:
                labels_to_send.append(legend_labels[np.argmax(sims)])
        except Exception as e:
            log_fn(f"❌ 분석 실패: {e}")

    log_fn("✅ 전설 분석 완료")

    if labels_to_send:
        try:
            log_fn(f"🌐 {len(labels_to_send)}개 라벨 전송 중...")
            response = requests.post(
                "https://tftmeta.co.kr/api/ranking/set",
                json=labels_to_send,
                timeout=10
            )
            if response.status_code == 200:
                log_fn("✅ 전송 성공")
            else:
                log_fn(f"⚠️ 전송 실패: {response.status_code}")
        except Exception as e:
            log_fn(f"💥 전송 중 오류 발생: {e}")
    else:
        log_fn("ℹ️ 전송할 라벨 없음")
