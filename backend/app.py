# -*- coding: utf-8 -*-
"""
Admin CMS - Thông tin trường Hàn
Flask backend with SQLite, JWT auth, CRUD API, Excel import
"""

import os
import sys
import json
import uuid
import re
import shutil
from datetime import datetime, timedelta
from functools import wraps

from werkzeug.security import generate_password_hash, check_password_hash
from flask import (
    Flask, jsonify, request, session, send_from_directory,
    render_template_string, redirect, url_for
)
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity, verify_jwt_in_request
)
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

# ── Config ──
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)  # thư mục gốc chứa data.js

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, '..', 'admin'), static_url_path='/admin')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'd26-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'admin.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'd26-jwt-secret-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max upload
app.config['UPLOAD_FOLDER'] = os.path.join(PROJECT_DIR, 'uploads')
app.config['IMAGES_FOLDER'] = os.path.join(PROJECT_DIR, 'images')

CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5000",
    "http://localhost:8768",
    "http://localhost:8769",
    "https://thongtintruonghan.vercel.app",
    "https://thong-tin-truong-han.vercel.app",
    "https://hoangtumua.pythonanywhere.com"
]}}) 
# Thêm PythonAnywhere domain vào CORS
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Init DB on first request (works with gunicorn)
_db_initialized = False
@app.before_request
def _init_db_once():
    global _db_initialized
    if not _db_initialized:
        _db_initialized = True
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            hashed = generate_password_hash('admin123')
            admin = User(username='admin', password_hash=hashed, role='admin')
            db.session.add(admin)
            db.session.commit()
            print('  Created default admin: admin / admin123')

# Ensure upload dirs
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['IMAGES_FOLDER'], exist_ok=True)

# ── Database Models ──

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class School(db.Model):
    __tablename__ = 'schools'
    id = db.Column(db.String(50), primary_key=True)  # e.g. "dh-osan"
    name = db.Column(db.String(200), nullable=False)
    name_kr = db.Column(db.String(200), default='')
    name_en = db.Column(db.String(200), default='')
    system = db.Column(db.String(100), default='')
    quota = db.Column(db.Integer, default=0)
    location = db.Column(db.Text, default='')
    region = db.Column(db.String(50), default='')
    intro = db.Column(db.Text, default='')
    tuition = db.Column(db.Text, default='')
    ktx = db.Column(db.Text, default='')
    insurance = db.Column(db.Text, default='')
    schedule = db.Column(db.Text, default='')
    mou = db.Column(db.Text, default='')
    website = db.Column(db.String(500), default='')
    catalog = db.Column(db.String(500), default='')
    catalog_link = db.Column(db.String(500), default='')
    invoice = db.Column(db.String(500), default='')
    video_url = db.Column(db.String(500), default='')
    video_title = db.Column(db.String(200), default='')
    conditions = db.Column(db.Text, default='[]')   # JSON array
    majors = db.Column(db.Text, default='[]')
    conversion = db.Column(db.Text, default='[]')
    advantages = db.Column(db.Text, default='[]')
    documents = db.Column(db.Text, default='[]')
    documents_note = db.Column(db.Text, default='')
    partners = db.Column(db.Text, default='[]')      # JSON array
    image_main = db.Column(db.String(500), default='images/placeholder.svg')
    image_catalog = db.Column(db.String(500), default='')
    image_location_map = db.Column(db.String(500), default='')
    image_invoice = db.Column(db.String(500), default='')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'nameKr': self.name_kr,
            'nameEn': self.name_en,
            'system': self.system,
            'quota': self.quota,
            'location': self.location,
            'region': self.region,
            'intro': self.intro,
            'tuition': self.tuition,
            'ktx': self.ktx,
            'insurance': self.insurance,
            'schedule': self.schedule,
            'mou': self.mou,
            'website': self.website,
            'catalog': self.catalog,
            'catalogLink': self.catalog_link,
            'invoice': self.invoice,
            'videoUrl': self.video_url,
            'videoTitle': self.video_title,
            'conditions': json.loads(self.conditions or '[]'),
            'majors': json.loads(self.majors or '[]'),
            'conversion': json.loads(self.conversion or '[]'),
            'advantages': json.loads(self.advantages or '[]'),
            'documents': json.loads(self.documents or '[]'),
            'documentsNote': self.documents_note,
            'partners': json.loads(self.partners or '[]'),
            'images': {
                'main': self.image_main or 'images/placeholder.svg',
                'catalog': self.image_catalog or '',
                'locationMap': self.image_location_map or '',
                'invoice': self.image_invoice or '',
            },
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_export(self):
        """Export to data.js format"""
        return {
            'id': self.id,
            'name': self.name,
            'nameKr': self.name_kr,
            'nameEn': self.name_en,
            'system': self.system,
            'quota': self.quota,
            'images': {
                'main': self.image_main or 'images/placeholder.svg',
                'catalog': self.image_catalog or '',
                'locationMap': self.image_location_map or '',
                'invoice': self.image_invoice or '',
                'gallery': [],
            },
            'links': {
                'website': self.website or '',
                'catalog': self.catalog_link or self.catalog or '',
                'invoice': self.invoice or '',
            },
            'video': {
                'url': self.video_url or '',
                'youtubeId': extract_youtube_id(self.video_url) if self.video_url else '',
                'title': self.video_title or '',
            },
            'location': self.location or '',
            'region': self.region or '',
            'intro': self.intro or '',
            'conditions': json.loads(self.conditions or '[]'),
            'majors': json.loads(self.majors or '[]'),
            'conversion': json.loads(self.conversion or '[]'),
            'tuition': self.tuition or '',
            'insurance': self.insurance or '',
            'ktx': self.ktx or '',
            'schedule': self.schedule or '',
            'advantages': json.loads(self.advantages or '[]'),
            'documents': json.loads(self.documents or '[]'),
            'documentsNote': self.documents_note or '',
            'partners': json.loads(self.partners or '[]'),
            'mou': self.mou or '',
        }


class ChangeLog(db.Model):
    __tablename__ = 'change_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(50))  # create, update, delete, import, export
    school_id = db.Column(db.String(50))
    details = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ── Logging ──
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

def log_error(msg):
    logging.error(f'[ADMIN] {msg}')

def log_info(msg):
    logging.info(f'[ADMIN] {msg}')

# ── Helpers ──

def extract_youtube_id(url):
    if not url:
        return ''
    import re
    m = re.search(r'(?:youtube\.com/watch\?.*v=|youtu\.be/)([a-zA-Z0-9_-]{11})', url)
    return m.group(1) if m else ''


def log_change(user_id, action, school_id=None, details=''):
    log = ChangeLog(user_id=user_id, action=action, school_id=school_id, details=details)
    db.session.add(log)
    db.session.commit()


def get_current_user():
    """Get current user from JWT identity"""
    user_id = get_jwt_identity()
    if user_id:
        return User.query.get(int(user_id))
    return None

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper


def load_schools_from_db():
    """Load all schools from DB into data.js format"""
    schools = School.query.all()
    result = {}
    for s in schools:
        result[s.id] = s.to_export()
    return result


def generate_advisor_profile(school_dict):
    """Generate advisor profile from school data (same logic as excel_to_data.py)"""
    text = ' '.join([
        str(school_dict.get('name', '')),
        str(school_dict.get('nameKr', '')),
        str(school_dict.get('location', '')),
        ' '.join(str(x) for x in school_dict.get('conditions', [])),
        ' '.join(str(x) for x in school_dict.get('advantages', [])),
        ' '.join(str(x) for x in school_dict.get('majors', [])),
        str(school_dict.get('tuition', '')),
        str(school_dict.get('system', '')),
        str(school_dict.get('intro', '')),
    ]).lower()

    profile = {}
    profile['gender'] = 'female' if ('nữ' in text or '여자' in text) else 'all'

    gpa_m = re.search(r'gpa[\s:]*([\d.]+)', text)
    profile['minGpa'] = float(gpa_m.group(1)) if gpa_m else 5.0

    abs_m = re.search(r'(?:ngh[ỉi]|vắng)\s*(?:kh[ôo]ng\s*qu[áa]\s*)?(\d+)\s*bu[ổo]i', text)
    profile['maxAbsences'] = int(abs_m.group(1)) if abs_m else 30

    region = str(school_dict.get('region', '') or '').lower()
    loc = str(school_dict.get('location', '') or '').lower()
    combined = region + ' ' + loc
    if 'seoul' in combined: profile['region'] = 'seoul'
    elif 'busan' in combined: profile['region'] = 'busan'
    elif 'gwangju' in combined: profile['region'] = 'gwangju'
    elif 'incheon' in combined: profile['region'] = 'incheon'
    elif 'gần seoul' in text or 'near-seoul' in text or 'gyeonggi' in combined: profile['region'] = 'near-seoul'
    else: profile['region'] = 'province'

    adv = str(school_dict.get('advantages', [])).lower()
    tui = str(school_dict.get('tuition', '') or '').lower()
    if 'rẻ' in adv or 'chi phí thấp' in adv: profile['costLevel'] = 2
    elif tui and ('1' in tui[:5]): profile['costLevel'] = 2
    elif tui and ('2' in tui[:5]): profile['costLevel'] = 3
    else: profile['costLevel'] = 3

    profile['visaChance'] = 4 if ('tỷ lệ' in text or 'visa' in text) else 3
    profile['jobOpportunity'] = 4 if 'việc làm' in text or 'làm thêm' in text else 3
    profile['e7Opportunity'] = 4 if 'e7' in text or 'chuyển đổi' in text else 3
    profile['studyLoad'] = 2 if 'học ít' in text else (4 if 'học nặng' in text else 3)

    if 'phỏng vấn' in text:
        profile['interviewDifficulty'] = 5 if 'siêu khó' in text or 'khó' in text else 4
    else:
        profile['interviewDifficulty'] = 2

    tags = []
    if profile.get('visaChance', 0) >= 4: tags.append('visa')
    if profile.get('jobOpportunity', 0) >= 4: tags.append('job')
    if profile.get('e7Opportunity', 0) >= 4: tags.append('e7')
    if profile.get('gender') == 'female': tags.append('female')
    if profile.get('costLevel', 5) <= 2: tags.append('low-cost')
    if profile.get('studyLoad', 5) <= 2: tags.append('low-study')
    if profile.get('region') == 'seoul': tags.append('seoul')
    elif profile.get('region') == 'near-seoul': tags.append('near-seoul')
    elif profile.get('region') == 'busan': tags.append('busan')
    profile['tags'] = tags[:8]
    return profile


def generate_data_js(schools_dict):
    """Generate data.js content from schools dict"""
    semester_info = {
        "ky": "3",
        "nam": "2027",
        "title": "DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027"
    }

    # Generate advisor profiles
    advisor_profiles = {}
    for sid, s in schools_dict.items():
        advisor_profiles[sid] = generate_advisor_profile(s)

    js = f"""// Dữ liệu các trường Hàn - Tự động sinh từ Admin CMS
// Cập nhật lần cuối: {datetime.now().strftime('%Y-%m-%d %H:%M')}

const SEMESTER_INFO = {json.dumps(semester_info, ensure_ascii=False)};

const SCHOOLS_DATA = {json.dumps(schools_dict, ensure_ascii=False, indent=2)};

const GENERATED_ADVISOR_PROFILES = {json.dumps(advisor_profiles, ensure_ascii=False, indent=2)};

const EXTRA_SHEETS = {json.dumps({"danhSach": {"rows": []}, "visaChecklist": {"items": []}, "phongVan": {"items": []}, "application": {"schools": []}, "tem": {"schools": []}}, ensure_ascii=False, indent=2)};
"""
    return js


# ── Auth Routes ──

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '')
    password = data.get('password', '')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Sai tên đăng nhập hoặc mật khẩu'}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Sai tên đăng nhập hoặc mật khẩu'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'token': access_token,
        'user': {'id': user.id, 'username': user.username, 'role': user.role}
    })


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': {'id': user.id, 'username': user.username, 'role': user.role}})


# ── Schools CRUD ──

@app.route('/api/schools', methods=['GET'])
@jwt_required()
def list_schools():
    schools = School.query.order_by(School.name).all()
    return jsonify({
        'schools': [s.to_dict() for s in schools],
        'total': len(schools)
    })


@app.route('/api/schools/<school_id>', methods=['GET'])
@jwt_required()
def get_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({'error': 'Không tìm thấy trường'}), 404
    return jsonify({'school': school.to_dict()})


@app.route('/api/schools', methods=['POST'])
@admin_required
def create_school():
    data = request.json
    school_id = data.get('id', '').strip().lower().replace(' ', '-')

    if School.query.get(school_id):
        return jsonify({'error': f'ID "{school_id}" đã tồn tại'}), 400

    school = School(
        id=school_id,
        name=data.get('name', ''),
        name_kr=data.get('nameKr', ''),
        name_en=data.get('nameEn', ''),
        system=data.get('system', ''),
        quota=int(data.get('quota', 0)),
        location=data.get('location', ''),
        region=data.get('region', ''),
        intro=data.get('intro', ''),
        tuition=data.get('tuition', ''),
        ktx=data.get('ktx', ''),
        insurance=data.get('insurance', ''),
        schedule=data.get('schedule', ''),
        mou=data.get('mou', ''),
        website=data.get('website', ''),
        catalog=data.get('catalog', ''),
        catalog_link=data.get('catalogLink', ''),
        invoice=data.get('invoice', ''),
        video_url=data.get('videoUrl', ''),
        video_title=data.get('videoTitle', ''),
        conditions=json.dumps(data.get('conditions', []), ensure_ascii=False),
        majors=json.dumps(data.get('majors', []), ensure_ascii=False),
        conversion=json.dumps(data.get('conversion', []), ensure_ascii=False),
        advantages=json.dumps(data.get('advantages', []), ensure_ascii=False),
        documents=json.dumps(data.get('documents', []), ensure_ascii=False),
        documents_note=data.get('documentsNote', ''),
        partners=json.dumps(data.get('partners', []), ensure_ascii=False),
    )

    images = data.get('images', {})
    if images.get('main'):
        school.image_main = images['main']
    if images.get('catalog'):
        school.image_catalog = images['catalog']
    if images.get('locationMap'):
        school.image_location_map = images['locationMap']
    if images.get('invoice'):
        school.image_invoice = images['invoice']

    db.session.add(school)
    db.session.commit()

    user = get_current_user()
    if user:
        log_change(user.id, 'create', school_id)

    return jsonify({'school': school.to_dict(), 'message': 'Đã thêm trường thành công'}), 201


@app.route('/api/schools/<school_id>', methods=['PUT'])
@admin_required
def update_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({'error': 'Không tìm thấy trường'}), 404

    data = request.json
    field_map = {
        'name': 'name', 'nameKr': 'name_kr', 'nameEn': 'name_en',
        'system': 'system', 'quota': 'quota', 'location': 'location',
        'region': 'region', 'intro': 'intro', 'tuition': 'tuition',
        'ktx': 'ktx', 'insurance': 'insurance', 'schedule': 'schedule',
        'mou': 'mou', 'website': 'website', 'catalog': 'catalog',
        'catalogLink': 'catalog_link', 'invoice': 'invoice',
        'videoUrl': 'video_url', 'videoTitle': 'video_title',
        'documentsNote': 'documents_note',
    }

    for js_field, db_field in field_map.items():
        if js_field in data:
            setattr(school, db_field, data[js_field])

    # JSON fields
    for field in ['conditions', 'majors', 'conversion', 'advantages', 'documents', 'partners']:
        if field in data:
            setattr(school, field, json.dumps(data[field], ensure_ascii=False))

    # Images
    images = data.get('images', {})
    if images.get('main'): school.image_main = images['main']
    if images.get('catalog'): school.image_catalog = images['catalog']
    if images.get('locationMap'): school.image_location_map = images['locationMap']
    if images.get('invoice'): school.image_invoice = images['invoice']

    db.session.commit()

    user = get_current_user()
    if user:
        log_change(user.id, 'update', school_id)

    return jsonify({'school': school.to_dict(), 'message': 'Đã cập nhật trường'})


@app.route('/api/schools/<school_id>', methods=['DELETE'])
@admin_required
def delete_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({'error': 'Không tìm thấy trường'}), 404

    db.session.delete(school)
    db.session.commit()

    user = get_current_user()
    if user:
        log_change(user.id, 'delete', school_id)

    return jsonify({'message': 'Đã xoá trường'})


# ── File Upload ──

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Không có file'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Chưa chọn file'}), 400

    # Determine folder
    folder = request.form.get('folder', 'uploads')
    if folder == 'images':
        dest = app.config['IMAGES_FOLDER']
    elif folder == 'catalogs':
        dest = os.path.join(PROJECT_DIR, 'documents')
        os.makedirs(dest, exist_ok=True)
    else:
        dest = app.config['UPLOAD_FOLDER']

    filename = secure_filename(file.filename)
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"

    filepath = os.path.join(dest, filename)
    file.save(filepath)

    rel_path = os.path.relpath(filepath, PROJECT_DIR).replace('\\', '/')
    return jsonify({'path': rel_path, 'filename': filename})


@app.route('/api/files/<path:filepath>')
def serve_file(filepath):
    """Serve uploaded files"""
    full_path = os.path.join(PROJECT_DIR, filepath)
    if os.path.exists(full_path):
        return send_from_directory(os.path.dirname(full_path), os.path.basename(full_path))
    return '', 404


# ── Import / Export ──

@app.route('/api/import/excel', methods=['POST'])
@admin_required
def import_excel():
    """Import schools from Excel file"""
    if 'file' not in request.files:
        return jsonify({'error': 'Không có file Excel'}), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'error': 'File không phải Excel (.xlsx)'}), 400

    # Save to project dir
    excel_path = os.path.join(PROJECT_DIR, 'import_temp.xlsx')
    file.save(excel_path)

    try:
        # Use the existing excel_to_data.py logic
        sys.path.insert(0, PROJECT_DIR)
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            'excel_to_data', os.path.join(PROJECT_DIR, 'excel_to_data.py')
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        # Load workbook and parse schools
        import openpyxl
        wb = openpyxl.load_workbook(excel_path, data_only=False, rich_text=True)

        schools_imported = 0
        errors = []

        for sheet_name in wb.sheetnames:
            sname = sheet_name.strip()
            # Skip non-school sheets using the same logic
            excluded = getattr(mod, 'EXCLUDED_SHEETS', [])
            if sname in excluded:
                continue

            d = mod.parse_school_sheet(wb[sname], sname)
            if d and d.get('name'):
                sid = mod.generate_school_id(sname)
                d['id'] = sid

                # Upsert
                existing = School.query.get(sid)
                if existing:
                    # Update existing
                    for key, val in d.items():
                        if key == 'id':
                            continue
                        if hasattr(existing, key):
                            if isinstance(val, (list, dict)):
                                setattr(existing, key, json.dumps(val, ensure_ascii=False))
                            elif isinstance(val, str):
                                setattr(existing, key, val)
                            elif isinstance(val, (int, float)):
                                setattr(existing, key, val)
                else:
                    school_data = d
                    school = School(id=sid)
                    for key, val in school_data.items():
                        if key == 'id':
                            continue
                        if hasattr(school, key):
                            if isinstance(val, (list, dict)):
                                setattr(school, key, json.dumps(val, ensure_ascii=False))
                            elif isinstance(val, str):
                                setattr(school, key, val)
                            elif isinstance(val, (int, float)):
                                setattr(school, key, val)
                    db.session.add(school)

                schools_imported += 1

        db.session.commit()

        user = get_current_user()
        if user:
            log_change(user.id, 'import', details=f'Imported {schools_imported} schools from Excel')

        # Clean up
        os.remove(excel_path)

        return jsonify({
            'message': f'Đã import {schools_imported} trường từ Excel',
            'imported': schools_imported,
            'errors': errors
        })

    except Exception as e:
        if os.path.exists(excel_path):
            os.remove(excel_path)
        return jsonify({'error': f'Lỗi import: {str(e)}'}), 500


@app.route('/api/export/data-js', methods=['POST'])
@admin_required
def export_data_js():
    """Export schools from DB to data.js file"""
    try:
        schools_dict = load_schools_from_db()
        js_content = generate_data_js(schools_dict)

        # Write to data.js
        data_js_path = os.path.join(PROJECT_DIR, 'data.js')
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)

        user = get_current_user()
        if user:
            log_change(user.id, 'export', details=f'Exported {len(schools_dict)} schools to data.js')

        return jsonify({
            'message': f'Đã export {len(schools_dict)} trường ra data.js',
            'count': len(schools_dict)
        })

    except Exception as e:
        return jsonify({'error': f'Lỗi export: {str(e)}'}), 500


@app.route('/api/export/push', methods=['POST'])
@admin_required
def export_and_push():
    """Export data.js + git commit + push lên GitHub"""
    try:
        # 1. Export data.js
        schools_dict = load_schools_from_db()
        js_content = generate_data_js(schools_dict)
        data_js_path = os.path.join(PROJECT_DIR, 'data.js')
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        # 2. Git commit + push
        github_token = os.getenv('GITHUB_TOKEN', '')
        git_repo = os.getenv('GIT_REPO', 'ThaoPT99/thong-tin-truong-han')
        
        if not github_token:
            return jsonify({
                'message': f'Đã export {len(schools_dict)} trường, nhưng chưa push (thiếu GITHUB_TOKEN trong .env)',
                'count': len(schools_dict),
                'pushed': False
            }), 200
        
        import subprocess
        
        def _git(args, timeout=15):
            return subprocess.run(['git'] + args, capture_output=True, text=True,
                                 timeout=timeout, cwd=PROJECT_DIR)
        
        remote_url = f'https://{github_token}@github.com/{git_repo}.git'
        
        # Git add + commit
        _git(['add', 'data.js'])
        commit = _git(['commit', '-m', f'auto-update admin {datetime.now().strftime("%Y-%m-%d %H:%M")}'])
        
        if commit.returncode != 0:
            user = get_current_user()
            if user:
                log_change(user.id, 'export', details=f'Exported {len(schools_dict)} schools (no git changes)')
            return jsonify({
                'message': f'✅ Đã export {len(schools_dict)} trường (không có thay đổi để push)',
                'count': len(schools_dict), 'pushed': False
            }), 200
        
        # Git push
        push = _git(['push', remote_url, 'main'], timeout=30)
        user = get_current_user()
        if user:
            log_change(user.id, 'export', details=f'Exported and pushed {len(schools_dict)} schools')
        
        if push.returncode == 0:
            return jsonify({
                'message': f'✅ Đã export {len(schools_dict)} trường và push lên GitHub! Vercel sẽ cập nhật sau 1-2 phút.',
                'count': len(schools_dict), 'pushed': True
            }), 200
        else:
            err = push.stderr[:200].replace(github_token, '***')
            return jsonify({
                'message': f'⚠️ Đã export {len(schools_dict)} trường, nhưng push thất bại: {err}',
                'count': len(schools_dict), 'pushed': False
            }), 200
        
    except Exception as e:
        log_error(f'Export + push error: {str(e)}')
        return jsonify({'error': f'Lỗi: {str(e)}'}), 500


# ── Dashboard Stats ──

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        total_schools = School.query.count()
        recent_changes = ChangeLog.query.order_by(ChangeLog.created_at.desc()).limit(10).all()

        # Schools with missing fields
        missing = {'tuition': 0, 'ktx': 0, 'conditions': 0, 'majors': 0}
        for s in School.query.all():
            if not s.tuition: missing['tuition'] += 1
            if not s.ktx: missing['ktx'] += 1
            if not s.conditions or s.conditions == '[]': missing['conditions'] += 1
            if not s.majors or s.majors == '[]': missing['majors'] += 1

        return jsonify({
            'totalSchools': total_schools,
            'missingData': missing,
            'recentChanges': [{
                'action': c.action,
                'schoolId': c.school_id,
                'details': c.details[:100],
                'time': c.created_at.isoformat() if c.created_at else None,
            } for c in recent_changes],
        })
    except Exception as e:
        log_error(f'Dashboard error: {str(e)}')
        return jsonify({'error': f'Lỗi dashboard: {str(e)}'}), 500


@app.route('/api/change-logs', methods=['GET'])
@jwt_required()
def change_logs():
    logs = ChangeLog.query.order_by(ChangeLog.created_at.desc()).limit(50).all()
    return jsonify({
        'logs': [{
            'id': l.id,
            'action': l.action,
            'schoolId': l.school_id,
            'details': l.details,
            'time': l.created_at.isoformat() if l.created_at else None,
        } for l in logs]
    })


# ── Admin Frontend Routes ──

@app.route('/admin/login')
def admin_login():
    return send_from_directory(app.static_folder, 'login.html')


@app.route('/admin/<path:path>')
def admin_static(path):
    return send_from_directory(app.static_folder, path)


@app.route('/')
def root():
    return redirect('/admin')

@app.route('/admin')
def admin_index():
    return redirect('/admin/login')


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
