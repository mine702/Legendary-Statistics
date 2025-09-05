import torch, os
from pathlib import Path
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np

REFERENCE_DIR = "reference_images"
VEC_OUT_PATH = "dinov2/data/dinov2.npy"

# 출력 폴더 생성
Path(VEC_OUT_PATH).parent.mkdir(parents=True, exist_ok=True)

# DINOv2(Base). 주석과 모델명이 다르면 여기 변경: "facebook/dinov2-giant"
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base", use_fast=True)
model = AutoModel.from_pretrained("facebook/dinov2-base")
model.eval()

ref_vectors = []
img_exts = (".jpg", ".jpeg", ".png")
for fname in sorted(os.listdir(REFERENCE_DIR)):
    if fname.lower().endswith(img_exts):
        img = Image.open(os.path.join(REFERENCE_DIR, fname)).convert("RGB")
        inputs = processor(images=img, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            vec = outputs.last_hidden_state[:, 0, :].squeeze().cpu().numpy()
        ref_vectors.append(vec)

if not ref_vectors:
    raise RuntimeError(f"이미지를 찾지 못했습니다: {REFERENCE_DIR} 안에 {img_exts} 파일이 있는지 확인하세요.")

ref_vectors = np.stack(ref_vectors)
np.save(VEC_OUT_PATH, ref_vectors)

print(f"[✅] 벡터 저장 완료 → {VEC_OUT_PATH} (총 {len(ref_vectors)}개)")
