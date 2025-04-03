import os
import shutil
from tqdm import tqdm

# 현재 파일 기준 yolo 루트 찾기
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
label_src_dir = os.path.join(root_dir, "labels", "train_aug")
label_dirs = os.path.join(root_dir, "labels")

# 증강 이름 리스트 (augmentation_map 키와 동일해야 함)
augmentation_names = [
    "brightness_plus_10", "brightness_plus_20", "brightness_plus_30", "brightness_plus_40", "brightness_plus_50",
    "brightness_minus_10", "brightness_minus_20", "brightness_minus_30", "brightness_minus_40", "brightness_minus_50",
    "contrast_plus_10", "contrast_plus_20", "contrast_plus_30",
    "contrast_minus_10", "contrast_minus_20", "contrast_minus_30",
    "saturation_plus_10", "saturation_plus_20", "saturation_plus_30",
    "saturation_minus_10", "saturation_minus_20",
    "hue_shift_plus_10", "hue_shift_minus_10", "hue_shift_plus_20",
    "gaussian_noise_std10", "gaussian_noise_std20", "gaussian_noise_std30", "gaussian_noise_std40",
    "gaussian_noise_std50", "gaussian_noise_std60", "gaussian_noise_std70",
    "salt_and_pepper_noise_light", "salt_and_pepper_noise_medium",
    "speckle_noise_light", "speckle_noise_medium",
    "poisson_noise", "uniform_noise", "impulse_noise", "random_noise_combined",
    "gaussian_blur_k3", "gaussian_blur_k5", "gaussian_blur_k7", "gaussian_blur_k9", "gaussian_blur_k11",
    "motion_blur_light", "motion_blur_medium",
    "median_blur_3", "median_blur_5", "box_blur_5",
    "grayscale", "invert", "solarize", "posterize", "equalize", "clahe",
    "cartoon_effect", "pencil_sketch", "emboss", "sharpen", "color_dropout", "channel_shuffle",
    "jpeg_compression_90", "jpeg_compression_70", "jpeg_compression_50",
    "histogram_matching", "histogram_dropout", "grayscale_histogram",
    "sketch_heavy", "cartoon_clahe", "invert_color_jitter", "contrast_sharpen",
    "light_enhance", "darkness_enhance", "soft_blend", "emboss_invert",
    "cutout_small", "cutout_medium", "cutout_large", "cutout_xlarge",
    "random_erasing_10px", "random_erasing_20px", "random_erasing_30px",
    "dropout_brightness", "erase_corner", "erase_center",
    "random_shadow", "random_fog", "shadow_horizontal", "shadow_vertical",
    "fog_dense", "fog_light", "vignetting", "brightness_wave", "gradient_mask", "dark_corner",
    "blur_plus_noise", "shadow_plus_contrast", "fog_plus_brightness_minus",
    "erase_plus_saturation_plus", "hue_shift_plus_dropout"
]

# train_aug에 존재하는 라벨 파일들
label_files = [f for f in os.listdir(label_src_dir) if f.endswith(".txt")]

# 복사 루프
for aug_name in tqdm(augmentation_names, desc="라벨 디렉토리 복사 중"):
    aug_label_dir = os.path.join(label_dirs, f"train_aug_{aug_name}")
    os.makedirs(aug_label_dir, exist_ok=True)

    for file in label_files:
        src = os.path.join(label_src_dir, file)
        dst = os.path.join(aug_label_dir, file)
        shutil.copyfile(src, dst)

print(f"✅ 총 {len(label_files)}개의 라벨 × {len(augmentation_names)}개 증강 → 복사 완료!")
