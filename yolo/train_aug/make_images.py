import os
import cv2
import time
import numpy as np
from tqdm import tqdm
from augmentation_functions import *

from PIL import Image  # PIL 변환용

# 현재 파일 기준 yolo 루트 디렉토리 계산
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
input_dir = os.path.join(root_dir, "images", "train_aug")

# 입력 이미지 목록 불러오기
image_files = [f for f in os.listdir(input_dir) if f.endswith(".png")]

# 100개의 증강 함수 이름과 매핑 딕셔너리
augmentation_map = {
    "brightness_plus_10": brightness_plus_10,
    "brightness_plus_20": brightness_plus_20,
    "brightness_plus_30": brightness_plus_30,
    "brightness_plus_40": brightness_plus_40,
    "brightness_plus_50": brightness_plus_50,
    "brightness_minus_10": brightness_minus_10,
    "brightness_minus_20": brightness_minus_20,
    "brightness_minus_30": brightness_minus_30,
    "brightness_minus_40": brightness_minus_40,
    "brightness_minus_50": brightness_minus_50,
    "contrast_plus_10": contrast_plus_10,
    "contrast_plus_20": contrast_plus_20,
    "contrast_plus_30": contrast_plus_30,
    "contrast_minus_10": contrast_minus_10,
    "contrast_minus_20": contrast_minus_20,
    "contrast_minus_30": contrast_minus_30,
    "saturation_plus_10": saturation_plus_10,
    "saturation_plus_20": saturation_plus_20,
    "saturation_plus_30": saturation_plus_30,
    "saturation_minus_10": saturation_minus_10,
    "saturation_minus_20": saturation_minus_20,
    "hue_shift_plus_10": hue_shift_plus_10,
    "hue_shift_minus_10": hue_shift_minus_10,
    "hue_shift_plus_20": hue_shift_plus_20,
    "gaussian_noise_std10": gaussian_noise_std10,
    "gaussian_noise_std20": gaussian_noise_std20,
    "gaussian_noise_std30": gaussian_noise_std30,
    "gaussian_noise_std40": gaussian_noise_std40,
    "gaussian_noise_std50": gaussian_noise_std50,
    "gaussian_noise_std60": gaussian_noise_std60,
    "gaussian_noise_std70": gaussian_noise_std70,
    "salt_and_pepper_noise_light": salt_and_pepper_noise_light,
    "salt_and_pepper_noise_medium": salt_and_pepper_noise_medium,
    "speckle_noise_light": speckle_noise_light,
    "speckle_noise_medium": speckle_noise_medium,
    "poisson_noise": poisson_noise,
    "uniform_noise": uniform_noise,
    "impulse_noise": impulse_noise,
    "random_noise_combined": random_noise_combined,
    "gaussian_blur_k3": gaussian_blur_k3,
    "gaussian_blur_k5": gaussian_blur_k5,
    "gaussian_blur_k7": gaussian_blur_k7,
    "gaussian_blur_k9": gaussian_blur_k9,
    "gaussian_blur_k11": gaussian_blur_k11,
    "motion_blur_light": motion_blur_light,
    "motion_blur_medium": motion_blur_medium,
    "median_blur_3": median_blur_3,
    "median_blur_5": median_blur_5,
    "box_blur_5": box_blur_5,
    "grayscale": grayscale,
    "invert": invert,
    "solarize": solarize,
    "posterize": posterize,
    "equalize": equalize,
    "clahe": clahe,
    "cartoon_effect": cartoon_effect,
    "pencil_sketch": pencil_sketch,
    "emboss": emboss,
    "sharpen": sharpen,
    "color_dropout": color_dropout,
    "channel_shuffle": channel_shuffle,
    "jpeg_compression_90": jpeg_compression_90,
    "jpeg_compression_70": jpeg_compression_70,
    "jpeg_compression_50": jpeg_compression_50,
    "histogram_matching": histogram_matching,
    "histogram_dropout": histogram_dropout,
    "grayscale_histogram": grayscale_histogram,
    "sketch_heavy": sketch_heavy,
    "cartoon_clahe": cartoon_clahe,
    "invert_color_jitter": invert_color_jitter,
    "contrast_sharpen": contrast_sharpen,
    "light_enhance": light_enhance,
    "darkness_enhance": darkness_enhance,
    "soft_blend": soft_blend,
    "emboss_invert": emboss_invert,
    "cutout_small": cutout_small,
    "cutout_medium": cutout_medium,
    "cutout_large": cutout_large,
    "cutout_xlarge": cutout_xlarge,
    "random_erasing_10px": random_erasing_10px,
    "random_erasing_20px": random_erasing_20px,
    "random_erasing_30px": random_erasing_30px,
    "dropout_brightness": dropout_brightness,
    "erase_corner": erase_corner,
    "erase_center": erase_center,
    "random_shadow": random_shadow,
    "random_fog": random_fog,
    "shadow_horizontal": shadow_horizontal,
    "shadow_vertical": shadow_vertical,
    "fog_dense": fog_dense,
    "fog_light": fog_light,
    "vignetting": vignetting,
    "brightness_wave": brightness_wave,
    "gradient_mask": gradient_mask,
    "dark_corner": dark_corner,
    "blur_plus_noise": blur_plus_noise,
    "shadow_plus_contrast": shadow_plus_contrast,
    "fog_plus_brightness_minus": fog_plus_brightness_minus,
    "erase_plus_saturation_plus": erase_plus_saturation_plus,
    "hue_shift_plus_dropout": hue_shift_plus_dropout
}

for filename in tqdm(image_files, desc="전체 이미지 증강 중"):
    class_id = os.path.splitext(filename)[0]
    image_path = os.path.join(input_dir, filename)

    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ 이미지 로드 실패: {image_path}")
        continue

    for aug_name, func in augmentation_map.items():
        try:
            aug_img = func(image.copy())

            # PIL 객체인 경우 numpy로 변환
            if isinstance(aug_img, Image.Image):
                aug_img = cv2.cvtColor(np.array(aug_img), cv2.COLOR_RGB2BGR)

            # 저장 디렉토리: yolo/images/train_aug_<증강명>/
            save_img_dir = os.path.join(root_dir, "images", f"train_aug_{aug_name}")
            os.makedirs(save_img_dir, exist_ok=True)

            save_path = os.path.join(save_img_dir, f"{class_id}.png")
            cv2.imwrite(save_path, aug_img)


        except Exception as e:
            print(f"⚠️ {filename} → {aug_name} 실패: {e}")
    time.sleep(0.01)

print(f"✅ 총 {len(image_files)}장 이미지에 대해 증강 완료 (각 100개씩)")