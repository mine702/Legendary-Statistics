import os
from pathlib import Path
from PIL import Image, ImageFilter
import cv2
import numpy as np
from tqdm import tqdm

# 원본 이미지 폴더 경로
input_dir = Path("images/train_aug")

# 저장할 블러 및 노이즈 폴더들
output_dirs = {
    "blur_2": Path("images/train_aug_blur_2"),
    "blur_3": Path("images/train_aug_blur_3"),
    "blur_4": Path("images/train_aug_blur_4"),
    "blur_5": Path("images/train_aug_blur_5"),
    "sp_noise": Path("images/train_aug_sp_noise"),
    "motion_blur": Path("images/train_aug_motion_blur")
}

# 폴더 생성
for path in output_dirs.values():
    path.mkdir(parents=True, exist_ok=True)

# 이미지 처리 함수들
def apply_sp_noise(img_array, amount=0.005):
    noisy = img_array.copy()
    num_salt = np.ceil(amount * img_array.size * 0.5).astype(int)
    coords = [np.random.randint(0, i - 1, num_salt) for i in img_array.shape[:2]]
    noisy[coords[0], coords[1]] = 255

    num_pepper = np.ceil(amount * img_array.size * 0.5).astype(int)
    coords = [np.random.randint(0, i - 1, num_pepper) for i in img_array.shape[:2]]
    noisy[coords[0], coords[1]] = 0
    return noisy

def apply_motion_blur(img_array, kernel_size=15):
    kernel = np.zeros((kernel_size, kernel_size))
    kernel[int((kernel_size - 1) / 2), :] = np.ones(kernel_size)
    kernel /= kernel_size
    return cv2.filter2D(img_array, -1, kernel)

# 이미지 처리 시작
image_files = sorted(list(input_dir.glob("*.png")) + list(input_dir.glob("*.jpg")))

for img_path in tqdm(image_files, desc="Processing images"):
    img = Image.open(img_path).convert("RGB")
    img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    filename = img_path.name

    # Gaussian Blur
    for k in range(2, 6):
        blurred = img.filter(ImageFilter.GaussianBlur(radius=k))
        blurred.save(output_dirs[f"blur_{k}"] / filename)

    # Salt & Pepper Noise
    sp = apply_sp_noise(img_cv, amount=0.01)
    cv2.imwrite(str(output_dirs["sp_noise"] / filename), sp)

    # Motion Blur
    mb = apply_motion_blur(img_cv)
    cv2.imwrite(str(output_dirs["motion_blur"] / filename), mb)

print("✅ 모든 이미지 처리 완료")
