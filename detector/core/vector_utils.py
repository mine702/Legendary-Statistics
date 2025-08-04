# core/vector_utils.py
import torch
from transformers import AutoImageProcessor, AutoModel
from PIL import Image as PILImage

# === 모델 로딩 (전역에서 한 번만) ===
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base", use_fast=False)
model = AutoModel.from_pretrained("facebook/dinov2-base")
model.eval()

# === 이미지 → 벡터 변환 함수 ===
def get_frame_vector(img: PILImage.Image):
    inputs = processor(images=img, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze().cpu().numpy()
