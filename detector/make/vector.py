import os
import json
import numpy as np
from PIL import Image
from transformers import AutoImageProcessor, AutoModel
import torch
from tqdm import tqdm

# === 모델 준비 ===
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base")
model = AutoModel.from_pretrained("facebook/dinov2-base")
model.eval()

def image_to_vec(img: Image.Image):
    inputs = processor(images=img, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    vec = outputs.last_hidden_state[:, 0, :].squeeze().cpu().numpy()
    return vec

# === 이미지 폴더 ===
legend_dir = "screen"  # 전설 카드 이미지 폴더
vector_list = []
label_list = []

# === 모든 이미지 벡터화 ===
for fname in tqdm(os.listdir(legend_dir)):
    if not fname.lower().endswith((".jpg", ".png", ".jpeg")):
        continue
    path = os.path.join(legend_dir, fname)
    try:
        img = Image.open(path).convert("RGB")
        vec = image_to_vec(img)
        vector_list.append(vec)
        label_list.append(fname)
    except Exception as e:
        print(f"❌ {fname} 처리 실패: {e}")

# === 저장 ===
os.makedirs("vector_db", exist_ok=True)
np.save("../dinov2/data/legend_vectors.npy", np.array(vector_list))
with open("../dinov2/data/legend_labels.json", "w", encoding="utf-8") as f:
    json.dump(label_list, f, ensure_ascii=False, indent=2)

print(f"✅ 총 {len(vector_list)}개 이미지 벡터화 완료 및 저장됨.")
