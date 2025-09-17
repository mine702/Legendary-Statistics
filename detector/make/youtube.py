import os
import glob
import cv2
import subprocess

os.environ["OPENCV_LOG_LEVEL"] = "SILENT"

try:
    cv2.utils.logging.setLogLevel(cv2.utils.logging.LOG_LEVEL_SILENT)
except Exception:
    pass

yt_link = "https://www.youtube.com/live/C1sNAOzj_K8?si=dpLg6BsnBsHgT8dy"

video_dir = "downloaded_video"
frames_dir = "video_frames"
os.makedirs(video_dir, exist_ok=True)
os.makedirs(frames_dir, exist_ok=True)

# ❶ 출력 템플릿: 확장자 자동 반영
out_tmpl = os.path.join(video_dir, "video.%(ext)s")

print("📥 영상 다운로드 중...")
# ❷ 포맷 전략:
#    - 우선 분리 트랙(bv*+ba) 조합 시도
#    - 실패 시 단일 스트림(b)로 폴백
#    - 해상도는 최대 1080 우선 정렬
#    - 가능하면 mp4로 병합/리먹스
subprocess.run([
    "yt-dlp",
    "-f", "bv*",            # 분리비디오+오디오 또는 단일스트림
    "-S", "res:1080",            # 해상도 우선 정렬(1080 우선)
    "--merge-output-format", "mp4",  # 가능 시 mp4로 병합/리먹스
    "--concurrent-fragments", "32",
    "--http-chunk-size", "32M",
    "--retries", "20",
    "--fragment-retries", "20",
    "-o", out_tmpl,
    yt_link
], check=True)
print("✅ 영상 다운로드 완료!")

# ❸ 실제 내려온 파일 경로 찾기 (확장자 가변 대응)
candidates = sorted(glob.glob(os.path.join(video_dir, "video.*")), key=os.path.getmtime, reverse=True)
if not candidates:
    raise FileNotFoundError("다운로드된 영상 파일을 찾을 수 없습니다.")
video_path = candidates[0]

print("🖼️ 프레임 추출 중...")
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
interval = int(fps * 3) if fps > 0 else 90  # 3초 간격

frame_id = 0
saved = 0
while frame_id < total_frames:
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
    ret, frame = cap.read()
    if not ret:
        break
    frame_filename = f"frame_4_{saved:04d}.jpg"
    cv2.imwrite(os.path.join(frames_dir, frame_filename), frame)
    saved += 1
    frame_id += interval

cap.release()
print(f"✅ 프레임 추출 완료: 총 {saved}장 저장됨")
