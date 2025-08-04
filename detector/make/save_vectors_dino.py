# save_vectors_dino_npy_simple.py

import torch
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import os

# === 설정 ===
REFERENCE_DIR = "reference_images"
VEC_OUT_PATH = "dinov2/data/dinov2.npy"

# ✅ DINOv2-Giant 로딩
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base")
model = AutoModel.from_pretrained("facebook/dinov2-base")
model.eval()

# ✅ 벡터화
ref_vectors = []
for fname in sorted(os.listdir(REFERENCE_DIR)):  # 정렬로 순서 고정
    if fname.lower().endswith((".jpg", ".png")):
        img = Image.open(os.path.join(REFERENCE_DIR, fname)).convert("RGB")
        inputs = processor(images=img, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            vec = outputs.last_hidden_state[:, 0, :].squeeze().cpu().numpy()
        ref_vectors.append(vec)

ref_vectors = np.stack(ref_vectors)
np.save(VEC_OUT_PATH, ref_vectors)

print(f"[✅] 벡터 저장 완료 → {VEC_OUT_PATH} (총 {len(ref_vectors)}개)")
