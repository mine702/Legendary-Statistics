import os
import cv2
import subprocess

# 유튜브 링크
yt_link = "https://www.youtube.com/watch?v=LQXTB3aMd9Q"

# 저장 경로
video_dir = "downloaded_video"
frames_dir = "video_frames"
os.makedirs(video_dir, exist_ok=True)
os.makedirs(frames_dir, exist_ok=True)

# 영상 파일 경로
video_path = os.path.join(video_dir, "video.mp4")

# yt-dlp로 영상 다운로드
print("📥 영상 다운로드 중...")
subprocess.run([
    "yt-dlp",
    "-f", "best[ext=mp4]",
    "-o", video_path,
    yt_link
], check=True)
print("✅ 영상 다운로드 완료!")

# OpenCV로 프레임 추출
print("🖼️ 프레임 추출 중...")

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
interval = int(fps * 3)  # 3초 간격

frame_id = 0
saved = 0

while frame_id < total_frames:
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
    ret, frame = cap.read()
    if not ret:
        break

    frame_filename = f"frame_{saved:04d}.jpg"
    frame_path = os.path.join(frames_dir, frame_filename)
    cv2.imwrite(frame_path, frame)

    saved += 1
    frame_id += interval

cap.release()
print(f"✅ 프레임 추출 완료: 총 {saved}장 저장됨")
