import os
import json
import numpy as np
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLineEdit,
    QPushButton, QTextEdit, QFileDialog
)
from core.detect_thread import DownloadAndDetectThread


class DinoUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("롤토체스 전설이 탐지기")
        self.setMinimumSize(600, 400)

        self.ref_vectors = None
        self.legend_vectors = None
        self.legend_labels = []
        self.save_dir = None
        self.thread = None

        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        # 🔹 URL 입력 + 로그 지우기 버튼
        url_layout = QHBoxLayout()
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("🎥 영상 링크 입력")
        url_layout.addWidget(self.url_input)

        self.clear_btn = QPushButton("🧹")
        self.clear_btn.setFixedWidth(40)
        self.clear_btn.setFixedHeight(27)
        self.clear_btn.clicked.connect(self.clear_log)
        url_layout.addWidget(self.clear_btn)

        layout.addLayout(url_layout)

        # 🔹 로그 출력 영역
        self.log_area = QTextEdit()
        self.log_area.setReadOnly(True)
        layout.addWidget(self.log_area)

        # 🔹 벡터/라벨 수동 로딩 버튼
        file_btn_layout = QHBoxLayout()

        self.load_ref_btn = QPushButton("📂 탐지 벡터 로드")
        self.load_legend_pair_btn = QPushButton("📂 전설 세트 로드")
        self.select_save_dir_btn = QPushButton("📁 저장 폴더 선택")

        self.load_ref_btn.clicked.connect(self.load_ref_vector)
        self.load_legend_pair_btn.clicked.connect(self.load_legend_pair)
        self.select_save_dir_btn.clicked.connect(self.select_save_directory)

        file_btn_layout.addWidget(self.load_ref_btn)
        file_btn_layout.addWidget(self.load_legend_pair_btn)
        file_btn_layout.addWidget(self.select_save_dir_btn)

        layout.addLayout(file_btn_layout)

        # 🔹 시작 / 중단 버튼
        btn_layout = QHBoxLayout()
        self.start_btn = QPushButton("▶ 시작")
        self.stop_btn = QPushButton("🛑 중단")

        self.start_btn.clicked.connect(self.start_detection)
        self.stop_btn.clicked.connect(self.stop_detection)

        btn_layout.addWidget(self.start_btn)
        btn_layout.addWidget(self.stop_btn)

        layout.addLayout(btn_layout)

        self.setLayout(layout)
        self.set_buttons_state(False)  # 초기엔 중단 버튼 비활성화

    def set_buttons_state(self, is_running):
        self.start_btn.setEnabled(not is_running)
        self.stop_btn.setEnabled(is_running)

    def append_log(self, msg):
        self.log_area.append(msg)

    def clear_log(self):
        self.log_area.clear()

    def load_ref_vector(self):
        path, _ = QFileDialog.getOpenFileName(self, "탐지 벡터 로드", "", "NumPy 파일 (*.npy)")
        if path:
            try:
                self.ref_vectors = np.load(path)
                self.append_log(f"✅ 탐지 벡터 로드 성공: {len(self.ref_vectors)}개")
            except Exception as e:
                self.append_log(f"❌ 탐지 벡터 로딩 실패: {e}")

    def load_legend_pair(self):
        folder = QFileDialog.getExistingDirectory(self, "전설 벡터 + 라벨 폴더 선택")
        if not folder:
            return

        npy_files = [f for f in os.listdir(folder) if f.endswith(".npy")]
        json_files = [f for f in os.listdir(folder) if f.endswith(".json")]

        if len(npy_files) != 1 or len(json_files) != 1:
            self.append_log("❌ 해당 폴더에 .npy 또는 .json 파일이 정확히 하나씩 있어야 합니다.")
            return

        vec_path = os.path.join(folder, npy_files[0])
        label_path = os.path.join(folder, json_files[0])

        try:
            self.legend_vectors = np.load(vec_path)
        except Exception as e:
            self.append_log(f"❌ 전설 벡터 로딩 실패: {e}")
            return

        try:
            with open(label_path, encoding="utf-8") as f:
                self.legend_labels = json.load(f)
        except Exception as e:
            self.append_log(f"❌ 전설 라벨 로딩 실패: {e}")
            return

        if len(self.legend_vectors) != len(self.legend_labels):
            self.append_log(
                f"⚠️ 벡터 {len(self.legend_vectors)}개 vs 라벨 {len(self.legend_labels)}개: 수 불일치!"
            )
        else:
            self.append_log(
                f"✅ 전설 세트 로딩 완료: {len(self.legend_vectors)}개 벡터 + {len(self.legend_labels)}개 라벨"
            )

    def select_save_directory(self):
        folder = QFileDialog.getExistingDirectory(self, "저장 폴더 선택")
        if folder:
            self.save_dir = folder
            self.append_log(f"📁 저장 폴더 선택됨: {folder}")

    def start_detection(self):
        url = self.url_input.text().strip()
        if not url:
            self.append_log("❗ 링크를 입력하세요.")
            return
        if self.ref_vectors is None or self.legend_vectors is None or not self.legend_labels:
            self.append_log("❌ 벡터 또는 라벨이 로드되지 않았습니다.")
            return

        self.append_log(f"📥 시작: {url}")
        self.thread = DownloadAndDetectThread(
            url, self.ref_vectors, self.legend_vectors, self.legend_labels, self.save_dir
        )
        self.thread.log_signal.connect(self.append_log)
        self.thread.finished.connect(lambda: self.set_buttons_state(False))  # 스레드 종료 시 버튼 복원
        self.thread.start()
        self.set_buttons_state(True)  # 실행 중엔 시작 비활성, 중단만 활성

    def stop_detection(self):
        if self.thread and self.thread.isRunning():
            self.thread.stop()
            self.append_log("🛑 측정 종료 요청됨")
