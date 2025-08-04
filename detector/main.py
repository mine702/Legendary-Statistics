# main.py
import sys
from PyQt5.QtWidgets import QApplication
from ui.main_window import DinoUI

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = DinoUI()
    window.show()
    sys.exit(app.exec_())
