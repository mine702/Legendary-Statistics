import os

# 클래스 개수
num_classes = 1806

# YAML 경로
yaml_path = "data.yaml"
workspace_path = "/workspace"
images_root = "images"
val_path = "images/train"  # val은 기본적으로 train 기준으로 설정

# images 하위 폴더 전부 수집
train_dirs = [f"{images_root}/{d}" for d in os.listdir(images_root)
              if os.path.isdir(os.path.join(images_root, d))]
train_dirs.insert(0, "images/train") if "images/train" not in train_dirs else None

# YAML 작성
with open(yaml_path, "w") as f:
    f.write(f"path: {workspace_path}\n")
    f.write("train:\n")
    for folder in train_dirs:
        f.write(f"  - {folder}\n")
    f.write(f"val: {val_path}\n")
    f.write(f"nc: {num_classes}\n")
    f.write("names:\n")
    for i in range(num_classes):
        f.write(f"  - \"{i}\"\n")

print(f"✅ {yaml_path} 생성 완료! {len(train_dirs)}개 폴더 포함됨.")
