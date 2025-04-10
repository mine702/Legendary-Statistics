import os

image_dir = "images/train"
label_dir = "labels/train"
os.makedirs(label_dir, exist_ok=True)

IMG_WIDTH = 512
IMG_HEIGHT = 344
bbox_width = 200 / IMG_WIDTH       # ≈ 0.39
bbox_height = 200 / IMG_HEIGHT     # ≈ 0.58
x_center = 0.5
y_center = 0.5

# 파일명에서 숫자만 뽑아서 정렬
def extract_number(filename):
    return int(os.path.splitext(filename)[0])

image_list = sorted(
    [f for f in os.listdir(image_dir) if f.endswith(('.jpg', '.png', '.jpeg'))],
    key=extract_number
)

for image_file in image_list:
    class_id = extract_number(image_file)
    base_name = os.path.splitext(image_file)[0]
    label_path = os.path.join(label_dir, base_name + ".txt")
    with open(label_path, 'w') as f:
        f.write(f"{class_id} {x_center} {y_center} {bbox_width:.4f} {bbox_height:.4f}\n")
