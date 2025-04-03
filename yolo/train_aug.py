from PIL import Image
import os

image_dir = "images/train"
output_image_dir = "images/train_aug"
label_dir = "labels/train"
output_label_dir = "labels/train_aug"

os.makedirs(output_image_dir, exist_ok=True)
os.makedirs(output_label_dir, exist_ok=True)

crop_x_start = 128
crop_width = 256
orig_width = 512
orig_height = 344
new_width = 256
new_height = 344

for filename in sorted(os.listdir(image_dir)):
    if not filename.endswith(".png"):
        continue

    basename = os.path.splitext(filename)[0]

    # 0번 파일 스킵
    if int(basename) == 0:
        continue

    # 이미지 crop
    img = Image.open(os.path.join(image_dir, filename))
    crop_box = (crop_x_start, 0, crop_x_start + crop_width, orig_height)
    cropped_img = img.crop(crop_box)
    cropped_img.save(os.path.join(output_image_dir, f"{basename}.png"))

    # 라벨 처리
    label_path = os.path.join(label_dir, f"{basename}.txt")
    new_label_path = os.path.join(output_label_dir, f"{basename}.txt")

    if os.path.exists(label_path):
        with open(label_path, "r") as f_in, open(new_label_path, "w") as f_out:
            for line in f_in:
                parts = line.strip().split()
                if len(parts) != 5:
                    continue

                cls_id, cx, cy, w, h = parts
                cx = float(cx) * orig_width
                cy = float(cy) * orig_height
                w = float(w) * orig_width
                h = float(h) * orig_height

                x1 = cx - w / 2
                x2 = cx + w / 2

                if x2 < crop_x_start or x1 > crop_x_start + crop_width:
                    continue

                new_x1 = max(x1, crop_x_start) - crop_x_start
                new_x2 = min(x2, crop_x_start + crop_width) - crop_x_start
                new_cx = (new_x1 + new_x2) / 2 / new_width
                new_w = (new_x2 - new_x1) / new_width
                new_cy = cy / new_height
                new_h = h / new_height

                if new_w <= 0 or new_h <= 0:
                    continue

                f_out.write(f"{cls_id} {new_cx:.6f} {new_cy:.6f} {new_w:.6f} {new_h:.6f}\n")
