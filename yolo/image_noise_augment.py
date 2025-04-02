import os
import cv2
import numpy as np
from PIL import Image

# 원본 이미지 경로
src_folder = "images/train_aug"

# 노이즈 강도 (표준편차 기준)
noise_levels = [10, 20, 30]  # 강도별로 늘려가면서 실험해봐도 됨

for std in noise_levels:
    dst_folder = f"images/train_aug_noise_{std}"
    os.makedirs(dst_folder, exist_ok=True)

    for filename in os.listdir(src_folder):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            path = os.path.join(src_folder, filename)
            img = cv2.imread(path)

            # 가우시안 노이즈 생성
            noise = np.random.normal(0, std, img.shape).astype(np.float32)

            # 이미지 + 노이즈
            noisy_img = img.astype(np.float32) + noise
            noisy_img = np.clip(noisy_img, 0, 255).astype(np.uint8)

            # 저장
            cv2.imwrite(os.path.join(dst_folder, filename), noisy_img)

    print(f"✅ Noise std {std} → {dst_folder} 저장 완료")
