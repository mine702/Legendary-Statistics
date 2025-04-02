FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# 필요한 패키지들 설치 (libgl1 + glib 포함)
RUN apt update && apt install -y python3-pip git libgl1 libglib2.0-0 && apt clean

# pip 최신화 + ultralytics 설치
RUN pip3 install --upgrade pip
RUN pip3 install ultralytics

# 작업 디렉토리
WORKDIR /workspace
COPY . /workspace
