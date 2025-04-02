import os
from pathlib import Path
from PIL import Image, ImageEnhance
import numpy as np
import random
import cv2
from tqdm import tqdm

# 원본 이미지 경로
input_dir = Path("images/train_aug")

# 출력 폴더들 생성
output_dirs = {
    "cutout": Path("images/train_aug_cutout"),
    "zoom_shift": Path("images/train_aug_zoom_shift"),
    "color_jitter": Path("images/train_aug_color_jitter")
}
for path in output_dirs.values():
    path.mkdir(parents=True, exist_ok=True)

# -------------------------------
# 🟦 증강 함수들 정의
# -------------------------------

# 1. Cutout (랜덤 네모 가리기)
def apply_cutout(img, mask_size=60):
    h, w = img.shape[:2]
    top = random.randint(0, h - mask_size)
    left = random.randint(0, w - mask_size)
    img[top:top + mask_size, left:left + mask_size] = 0
    return img

# 2. Zoom + Shift
def apply_zoom_shift(img, zoom=1.2):
    h, w = img.shape[:2]
    nh, nw = int(h * zoom), int(w * zoom)
    img_zoomed = cv2.resize(img, (nw, nh))

    top = random.randint(0, nh - h)
    left = random.randint(0, nw - w)
    img_cropped = img_zoomed[top:top + h, left:left + w]
    return img_cropped

# 3. Color Jitter (채도, 명도, 대비 랜덤 조절)
def apply_color_jitter(pil_img):
    brightness = ImageEnhance.Brightness(pil_img).enhance(random.uniform(0.7, 1.3))
    contrast = ImageEnhance.Contrast(brightness).enhance(random.uniform(0.7, 1.3))
    color = ImageEnhance.Color(contrast).enhance(random.uniform(0.7, 1.3))
    return color

# -------------------------------
# 🔄 처리 루프
# -------------------------------

image_files = sorted(list(input_dir.glob("*.png")) + list(input_dir.glob("*.jpg")))

for img_path in tqdm(image_files, desc="Augmenting"):
    filename = img_path.name
    img_cv = cv2.imread(str(img_path))
    pil_img = Image.open(img_path).convert("RGB")

    # 1. Cutout
    cutout = apply_cutout(img_cv.copy(), mask_size=60)
    cv2.imwrite(str(output_dirs["cutout"] / filename), cutout)

    # 2. Zoom + Shift
    zoomed = apply_zoom_shift(img_cv.copy(), zoom=1.2)
    cv2.imwrite(str(output_dirs["zoom_shift"] / filename), zoomed)

    # 3. Color Jitter
    jittered = apply_color_jitter(pil_img)
    jittered.save(output_dirs["color_jitter"] / filename)

print("✅ 증강 완료!")
