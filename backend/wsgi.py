"""
PythonAnywhere WSGI entry point.
Đặt file này cùng thư mục với app.py.

Cách dùng trên PythonAnywhere:
1. Web tab -> Add a new web app -> Manual configuration -> Python 3.10
2. Trong "Code" section:
   - Working directory: /home/yourusername/thong-tin-truong-han/backend
   - WSGI configuration file: /var/www/yourusername_pythonanywhere_com_wsgi.py
     (Nội dung: từ dòng 20 trở xuống)
3. Virtualenv: /home/yourusername/.virtualenvs/thong-tin-truong-han
"""
import sys
import os

# Đường dẫn tới project
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import Flask app
from app import app as application

if __name__ == '__main__':
    application.run()
