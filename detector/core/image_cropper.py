# core/image_cropper.py
import os
from itertools import product
from PIL import Image


def simple_crop(image_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(image_path)
    w, h = img.size
    cx = w // 2
    count = 0

    for pct in range(52, 63, 2):  # 52%, 54%, ..., 62%
        cw = int(w * (pct / 100))
        cropped = img.crop((cx - cw // 2, 0, cx + cw // 2, h))
        hh = cropped.height // 2
        hw = cropped.width // 2

        for i, j, k in product((0, 1), repeat=3):
            box1 = (0, i * hh, cropped.width, (i + 1) * hh)
            box2 = (j * hw, box1[1], (j + 1) * hw, box1[3])
            qw = (box2[2] - box2[0]) // 2
            box3 = (box2[0] + k * qw, box2[1], box2[0] + (k + 1) * qw, box2[3])
            part = cropped.crop(box3)
            filename = f"crop_{os.path.splitext(os.path.basename(image_path))[0]}_{pct}pct_{i}{j}{k}.jpg"
            part.save(os.path.join(output_dir, filename))
            count += 1

    return count
