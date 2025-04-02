import os
from PIL import Image, ImageEnhance

# 원본 이미지 폴더
source_dir = "images/train_aug"

# 밝기 조절 결과 저장할 폴더
bright_dir = "images/train_aug_bright"
dark_dir = "images/train_aug_dark"

# 결과 폴더 없으면 생성
os.makedirs(bright_dir, exist_ok=True)
os.makedirs(dark_dir, exist_ok=True)

# 밝기 조절 계수
bright_factor = 1.5  # 더 밝게
dark_factor = 0.5    # 더 어둡게

# 이미지 반복 처리
for filename in os.listdir(source_dir):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        img_path = os.path.join(source_dir, filename)
        img = Image.open(img_path).convert("RGB")  # ⭐️ 이미지 모드 강제 변환

        # 밝게
        enhancer = ImageEnhance.Brightness(img)
        brighter_img = enhancer.enhance(bright_factor)
        brighter_img.save(os.path.join(bright_dir, filename))

        # 어둡게
        darker_img = enhancer.enhance(dark_factor)
        darker_img.save(os.path.join(dark_dir, filename))

print("명암 조절 완료 ✅")
