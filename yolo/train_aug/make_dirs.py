import os

# 기존 63개
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

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

images_root = os.path.join(root_dir, "images")
labels_root = os.path.join(root_dir, "labels")

# 디렉토리 생성
for name in augmentation_names:
    img_dir = os.path.join(images_root, f"train_aug_{name}")
    lbl_dir = os.path.join(labels_root, f"train_aug_{name}")

    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(lbl_dir, exist_ok=True)

print(f"✅ 총 {len(augmentation_names)}개의 디렉토리 생성 완료!")
