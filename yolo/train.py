from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # ✅ YOLOv8 Large 모델 로드 (중간 크기보다 성능 높음)

model.train(
    data="data.yaml",  # ✅ 학습용 데이터셋 경로 지정 (클래스, 경로 정의된 YAML 파일)

    epochs=150,  # ✅ 최대 학습 에폭 수 (충분히 돌려야 성능 수렴함)
    imgsz=640,  # ✅ 입력 이미지 크기 (640보다 크면 정확도↑, 메모리 사용↑)
    batch=26,  # ✅ 배치 사이즈 (GPU VRAM 맞춰 설정, 3060은 보통 8~16 가능, 개구라임 V100 으로 했을때 20도 버거웠음)

    lr0=0.001,  # ✅ 초기 학습률 (기본은 0.01인데, l 모델은 낮게 잡는 게 안정적)
    lrf=0.01,  # ✅ 최종 학습률 비율 (마지막에 lr0 * lrf 로 학습 마무리)
    weight_decay=0.001,  # ✅ L2 정규화로 과적합 방지

    warmup_epochs=5.0,  # ✅ 초반 학습률 천천히 증가시키는 구간 (안정적인 시작)

    hsv_s=0.5,  # ✅ 색상 채도 증강 (0~1). 너무 높으면 과하게 왜곡됨
    hsv_v=0.3,  # ✅ 밝기 증강 정도 (0.3이면 안정적)
    mosaic=0.3,  # ✅ mosaic augmentation 비율 (객체 다양화에 도움)
    mixup=0.0,  # ✅ mixup 비활성화 (분류 성능이 중요할 땐 꺼두는 게 좋음)

    dropout=0.1,  # ✅ 드롭아웃 적용 (클래스 수 많을 땐 분류 안정화에 도움)
    patience=50,  # ✅ val 성능 변화 없을 때 조기 종료까지 대기할 에폭 수

    box=7.5,  # ✅ box loss 비중 ↑ (더 정확한 위치 박스 학습 유도)
    cls=0.5,  # ✅ 분류 손실 비중 ↓ (클래스 수 많으므로 안정화 목적)
    dfl=1.5,  # ✅ Distance Focal Loss 비중 (bounding box 품질 향상)

    close_mosaic=10,  # ✅ 마지막 10에폭 동안 mosaic augmentation 비활성화 → 수렴 안정
    save_period=10,  # ✅ 10에폭마다 체크포인트 저장 (중간 저장 백업 가능)
    
    cache="ram",
    # wandb=True            # 🟡 (선택) Weights & Biases 연동해서 학습 로그 시각화 가능
)
