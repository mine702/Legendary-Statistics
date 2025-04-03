from ultralytics import YOLO

# 모델 로딩
model = YOLO("best.pt")

# 이미지 예측
results = model("test.jpg", conf=0.001, save=True)
res = results[0]  # 첫 번째 결과 가져오기

# 객체 출력
boxes = res.boxes
names = model.names  # 클래스 이름 dict

print(f"총 {len(boxes)}개 객체 감지됨:\n")

for i, box in enumerate(boxes):
    cls_id = int(box.cls[0])
    conf = float(box.conf[0])
    xyxy = box.xyxy[0].tolist()  # 좌표 [x1, y1, x2, y2]

    print(f"[{i+1}] 클래스: {names[cls_id]} (ID: {cls_id})")
    print(f"     신뢰도: {conf:.6f}")
    print(f"     좌표: x1={xyxy[0]:.1f}, y1={xyxy[1]:.1f}, x2={xyxy[2]:.1f}, y2={xyxy[3]:.1f}\n")

