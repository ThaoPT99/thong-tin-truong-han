// Dữ liệu các trường Hàn - Tự động sinh từ Excel
// File nguồn: Thong_tin_truong_Han_ky_thang_3_2027.xlsx
// Chạy: python excel_to_data.py

const SEMESTER_INFO = {"ky": "3", "nam": "2027", "title": "DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027"};

const SCHOOLS_DATA = {
  "dh-osan": {
    "id": "dh-osan",
    "name": "Osan",
    "nameKr": "오산대학교 | Dễ chuyển đổi E7, học ít - Yêu cầu khó, việc làm nhiều - PV siêu khó",
    "nameEn": "Osan University",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Giới-thiệu-trường-Osan.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=noj5lFV5Feg",
      "youtubeId": "noj5lFV5Feg",
      "title": "[오산대학교 국제교류원] 한국어학당 호텔조리계열 학과 체험｜오산대학교 Osan University\n[오산대학"
    },
    "location": "45 Cheonghak-ro, Osan-si, Gyeonggi-do, Hàn Quốc (cách Seoul 35 km về phía Nam )",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 6,3 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "Sau khi pass Visa: \n•     Các học sinh sẽ ở KTX trong 3 tháng 600.000 KRW/3 tháng và có thể phải chuyển nhà vào 3 tháng tiếp theo có người hỗ trợ tìm nhà ở.\n•     Chi phí sinh hoạt: Khoảng 500.000 KRW/tháng \n•     Chi phí nhà ở: \n-     Tiền cọc nhà: 1.000.000 KRW\n-     Tiền thuê nhà: 400.000 KRW/1 tháng\n-     Lưu ý: đã có học sinh tìm được nhà giá cọc chỉ có 600.000 krw và tiền thuê nhà 280.000 krw/1 tháng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "1. NGUYEN TIEN DUNG.jpg",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, HCCT, VTV, SGT, KTTU"
  },
  "dh-induk": {
    "id": "dh-induk",
    "name": "Induk",
    "nameKr": "인덕대학교 | Học ít - Việc làm nhiều - Cạnh tranh cao, lương cao - Tỷ lệ Visa không quá tốt",
    "nameEn": "Induk University Học ít -",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Induk-University-Catalog-(1).pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=VNYkbySK0vg",
      "youtubeId": "VNYkbySK0vg",
      "title": ""
    },
    "location": "12 Choansan-ro, Wolgye‑dong, Nowon‑gu, Seoul 01878, Hàn Quốc",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 5.5 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "•  KTX: 4 người/1 phòng( không bao gồm ăn)\nLưu ý: \n- KTX dành cho nữ 200,000 KRW/1 tháng ở trong khuôn viên trường. ( 16 tuần học và 8 tuần nghỉ ).\n- KTX dành cho nam 250,000 KRW/1 tháng, cách trường 20 phút đi tầu. ( 16 tuần học và  8 tuần nghỉ ).\n•  Chi phí nhập học: 214.000 KRW ( Chưa bao gồm tiền chăn gối, sách)\n*  Phí xe buýt đón: 30.000 KRW\n*  Phí đăng ký cư trú: 34.000 KRW\n*  Bảo hiểm: 100.000 KRW\n*  Trải nghiệm văn hóa: 50.000 KRW",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, VTV, BGIT, TWU, SDU, DH"
  },
  "dh-yeonsung": {
    "id": "dh-yeonsung",
    "name": "YeonSung",
    "nameKr": "연성대학교 | Việc làm nhiều - Tỷ lệ đỗ cực cao - Gần Seoul",
    "nameEn": "Yeonsung University",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Yeonsung-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=ICVUWdCIUU4",
      "youtubeId": "ICVUWdCIUU4",
      "title": "우리의 꿈 in 연성｜연성대학교 Yeonsung University"
    },
    "location": "Địa chỉ: 34 Yanghwa-ro 37beon-gil, Manan-gu, Anyang-si, Gyeonggi-do, Hàn Quốc\n\nNằm tại quận Manan, thành phố Anyang (Gyeonggi), thuộc vùng thủ đô Seoul – kết nối thuận tiện bằng tàu, xe buýt, có shuttle bus từ ga Anyang .",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 5.5 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "- KTX nằm ngoài khuôn viên trường\n- Giá giao động 1.650.000 KRW/6 tháng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, HCCT, BGIT, KTTT, SGT, DA, SDU, KTTU"
  },
  "dh-sangmyung": {
    "id": "dh-sangmyung",
    "name": "Sangmyung",
    "nameKr": "상명대학교 | Trường 4 năm uy tín tại Seoul - Tỷ lệ chuyển E7 tốt - Học nặng hơn",
    "nameEn": "Sangmyung University",
    "system": "D2-6 > D2-2 (Đại học 4 năm)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Sangmyung-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=umdE4TXwaXI",
      "youtubeId": "umdE4TXwaXI",
      "title": ""
    },
    "location": "20 Hongjimun 2-gil, Jongno-gu, Seoul 03016, Hàn Quốc (Campus Seoul) | 31 Sangmyungdae-gil, Cheonan-si, Chungcheongnam-do (Campus Cheonan)",
    "intro": "",
    "conditions": [
      "Dưới 22 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong 2b"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 350.000 - 500.000 KRW/tháng\nNhà thuê gần trường: 300.000 - 450.000 KRW/tháng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HNC, HCCT, VTV, BGIT, HPC-HP, KTTT, DH"
  },
  "dh-nu-sinh-kyungin": {
    "id": "dh-nu-sinh-kyungin",
    "name": "KyungGin",
    "nameKr": "경인여자대학교 | Tỷ lệ Visa rất tốt - Chuyển đổi E7 tốt - Gần sân bay Incheon - Chỉ dành cho nữ",
    "nameEn": "Kyungin Women’s University (KIWU)",
    "system": "D2-6 > D2-1 (Cao Đẳng )",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/_KyungGin-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Vup7-eqakBE",
      "youtubeId": "Vup7-eqakBE",
      "title": "경인의 설립이념, 상징에 대해 알아보아요ㅣ경인여대 오리엔테이션"
    },
    "location": "63 Gyeyangsan-ro, Gyesan-dong, Gyeyang-gu, Incheon, Hàn Quốc",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Chỉ dành cho nữ",
      "Có học bạ cấp 3 ( GPA 5.5 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong2b ( Fastgo có hỗ trợ Sejong2b) - Với kỳ tháng 3/2026 không yêu cầu chứng chỉ tiếng"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng.",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "300.000 KRW/1 tháng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "invoice KyungGin.pdf",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, VTV, BGIT, UTM, SGT, KTTU"
  },
  "dh-y-te-dongnam": {
    "id": "dh-y-te-dongnam",
    "name": "Dongnam",
    "nameKr": "동남보건대학교 | Tỷ lệ Đỗ tuyệt đối - Học khá nhiều - Việc làm thêm khá hạn chế",
    "nameEn": "Dongnam Health University",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Dongnam-University-Catalog-.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=2JCs1paO_Zo",
      "youtubeId": "2JCs1paO_Zo",
      "title": "동남보건대학교 건학50주년 기념식 영상"
    },
    "location": "Địa chỉ: 50 Cheoncheon‑ro 74‑gil, Jeongja‑dong, Jangan‑gu, Suwon‑si, Gyeonggi‑do, Hàn Quốc\n\nNằm ở phía bắc Suwon, trên bờ sông Seohocheon, trong khu vực đô thị thuận tiện di chuyển bằng bus và đi tới Seoul rất dễ dàng",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 5.5 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Invoice mẫu Đong Nam.pdf",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, HPC, HCCT, SGT, BCIT"
  },
  "dh-dongeui": {
    "id": "dh-dongeui",
    "name": "Dong-Eui",
    "nameKr": "동의대학교 | Tỷ lệ đỗ cực cao - Việc làm thêm nhiều - Tỷ lệ chuyển đổi E7 tốt - Học khá nặng",
    "nameEn": "DongEui Institute Of Technology",
    "system": "D2-6 > D2-2 (Đại học)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Catalog-Dong-Eui.pdf.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=xqT-_-3l8Yk",
      "youtubeId": "xqT-_-3l8Yk",
      "title": ""
    },
    "location": "176 Eomgwang-ro, Gaya 3(sam)-dong, Busanjin-gu, Busan, Hàn Quốc",
    "intro": "",
    "conditions": [
      "Dưới 22 tuổi",
      "Có học bạ cấp 3 ( GPA 5.5 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong2b ( Fastgo có hỗ trợ Sejong2b)"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 1 năm.",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX chỉ từ 150.000 KRW/1 tháng\n\nTặng kèm 100 xuất ăn miễn phí - Có thể nhiều hơn - Mỗi xuất giá 5000 won",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HNC, HCCT, VTV, HPC-HP, PMDT, UTM, SGT, SDU"
  },
  "cd-suncheon-jeil": {
    "id": "cd-suncheon-jeil",
    "name": "Suncheon Jeil",
    "nameKr": "순천제일 | Dễ chuyển đổi E7 - Tỷ lệ Visa tốt - Việc làm thêm đa dạng - Trường không hot",
    "nameEn": "Suncheon Jeil College",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Catalog-SucheonJeil-University.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=kwbtipY_jis",
      "youtubeId": "kwbtipY_jis",
      "title": ""
    },
    "location": "17 Jeildaehak-gil, Deogwol-dong, Suncheon-si, Jeollanam-do, 57997, Hàn Quốc",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 6,3 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "- Dự kiến : 1.000.000 KRW/5 tháng\n- Sẽ có Invoice sau khi đỗ phỏng vấn trường",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch HN",
        "nameKr": ""
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HNC, HCCT, VTV, HPC-HP, SGT, DH"
  },
  "dh-nu-sinh-busan": {
    "id": "dh-nu-sinh-busan",
    "name": "Nữ Busan",
    "nameKr": "부산여자대학교 | Trường nữ sinh Busan - Chi phí hợp lý - Gần trung tâm thành phố",
    "nameEn": "Busan Women's  College  New",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Nữ-sinh-Busan-catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=dBuO1y3L1U4",
      "youtubeId": "dBuO1y3L1U4",
      "title": "부산여자대학교 홍보영상"
    },
    "location": "Địa chỉ: 516 đường Jinman , Phường Yangjeong, quận Busanjin, Busan, Hàn Quốc\n\nTọa lạc tại vị trí chiến lược giáp Seomyeon, trung tâm Busan thành phố lớn thứ 2 tại Hàn Quốc ( dưới 10 phút di chuyển)",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 6,0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "720,000 KRW/6 tháng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Invoice Busan Women College",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HCCT, VTV, UTM, SGT, DH"
  },
  "dh-busan-catholic": {
    "id": "dh-busan-catholic",
    "name": "Busan Catholic",
    "nameKr": "부산가톨릭대학교 | Trường Công giáo uy tín tại Busan - Ngành Y tế nổi bật - Tỷ lệ Visa ổn định",
    "nameEn": "Catholic University of Busan",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Catholic-University-of-Busan-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Uw413FDFQG8",
      "youtubeId": "Uw413FDFQG8",
      "title": ""
    },
    "location": "57 Oesolsun-ro 303beon-gil, Geumjeong-gu, Busan 46252, Hàn Quốc\nNằm tại quận Geumjeong, thành phố Busan - gần núi Geumjeongsan, cách trung tâm Busan 20 phút tàu điện",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 250.000 - 350.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, HCCT, BGIT, HPC-HP, PMDT, UTM, KTTT, DA"
  },
  "dh-gimhae": {
    "id": "dh-gimhae",
    "name": "Gimhae",
    "nameKr": "김해대학교 | Gần sân bay Gimhae - Chi phí sinh hoạt thấp - Nhiều chuyên ngành kỹ thuật",
    "nameEn": "Gimhae College",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Gimhae-College-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=FTKBjPUMesA",
      "youtubeId": "FTKBjPUMesA",
      "title": ""
    },
    "location": "112 Hallim-ro, Hallim-myeon, Gimhae-si, Gyeongsangnam-do 50983, Hàn Quốc\nThành phố Gimhae, tỉnh Gyeongnam - cách sân bay quốc tế Gimhae (Busan) khoảng 20 phút, cách trung tâm Busan 40 phút",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 200.000 - 300.000 KRW/tháng\n4-6 người/phòng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HCCT, VTV, BGIT, HPC-HP, PMDT, UTM, ISPACE, DA, SDU"
  },
  "dh-gwangju": {
    "id": "dh-gwangju",
    "name": "Gwangju",
    "nameKr": "광주대학교 | Đại học uy tín Gwangju - Chi phí thấp - Khu vực miền Nam nhiều việc làm",
    "nameEn": "Gwangju University",
    "system": "D2-6 > D2-2 (Đại học 4 năm)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Gwangju-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=2GJEzQd1w_E",
      "youtubeId": "2GJEzQd1w_E",
      "title": ""
    },
    "location": "277 Hyodeok-ro, Nam-gu, Gwangju 61743, Hàn Quốc\nThành phố Gwangju - thành phố lớn thứ 5 Hàn Quốc, thủ phủ vùng Honam (Jeolla)",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 250.000 - 380.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HCCT, VTV, BGIT, UTM, KTTT, SGT"
  },
  "dh-nambu": {
    "id": "dh-nambu",
    "name": "Nambu",
    "nameKr": "남부대학교 | Đại học miền Nam Gwangju - Chi phí thấp nhất - Tỷ lệ Visa tốt",
    "nameEn": "Nambu University",
    "system": "D2-6 > D2-2 (Đại học 4 năm)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Nambu-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=SfPG7mkLXiw",
      "youtubeId": "SfPG7mkLXiw",
      "title": ""
    },
    "location": "23 Cheomdanmunhwa-ro, Gwangsan-gu, Gwangju 62271, Hàn Quốc\nNằm tại quận Gwangsan, thành phố Gwangju - gần sân bay quốc tế Gwangju, khu công nghệ cao Gwangju",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 200.000 - 320.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HNC, HCCT, VTV, BGIT, HPC-HP, PMDT, UTM, SGT, SDU, KTTU"
  },
  "dh-daewon": {
    "id": "dh-daewon",
    "name": "Daewon",
    "nameKr": "대원대학교 | Chi phí thấp - Hỗ trợ E7 liên kết Samsung & Hyundai - Có thể học Online",
    "nameEn": "Daewon College New",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Deawon-catalog-.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Qcui82cohB4",
      "youtubeId": "Qcui82cohB4",
      "title": ""
    },
    "location": "Địa chỉ: 316 Daehak-ro, Sinwol-dong, Jecheon, tỉnh Chungcheongbuk, Hàn Quốc\n\nVị trí : Thành phố Jecheon, tỉnh Bắc Chungcheong, Hàn Quốc. (cách thủ đô Seoul khoảng 2 giờ tàu điện)",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 6,0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "750,000KRW /1 kỳ",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HCCT, BGIT, PMDT, UTM, DH, KTTU"
  },
  "dh-sengmyung": {
    "id": "dh-sengmyung",
    "name": "Sengmyung",
    "nameKr": "세명대학교 | Trường địa phương ổn định - Chi phí thấp - Dễ chuyển đổi chuyên ngành",
    "nameEn": "Semyung University",
    "system": "D2-6 > D2-2 (Đại học 4 năm)",
    "quota": 200,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "documents/Semyung-University-Catalog.pdf"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=c9e0v_zZOFI",
      "youtubeId": "c9e0v_zZOFI",
      "title": ""
    },
    "location": "65 Semyung-ro, Jecheon-si, Chungcheongbuk-do 27136, Hàn Quốc\nThành phố Jecheon, tỉnh Bắc Chungcheong - cách Seoul khoảng 2 giờ tàu KTX, thiên nhiên đẹp",
    "intro": "",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 (GPA 5.5)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 180.000 - 280.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [],
    "documents": [],
    "documentsNote": "Cập nhật sau khi có invoice chính thức từ trường",
    "partners": [
      {
        "code": "HN",
        "name": "Cao đẳng Hà Nội",
        "nameKr": "Cao đẳng Hà Nội"
      },
      {
        "code": "HNC",
        "name": "Cao đẳng Hữu Nghị",
        "nameKr": "Cao đẳng Hữu Nghị"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng Thương mại và Du lịch Hà Nội",
        "nameKr": "Cao đẳng Thương mại và Du lịch Hà Nội"
      },
      {
        "code": "VTV",
        "name": "Cao đẳng Truyền hình Việt Nam",
        "nameKr": ""
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": ""
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": ""
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": ""
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": ""
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": ""
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": ""
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": ""
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": ""
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": ""
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": ""
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": ""
      }
    ],
    "mou": "HN, HNC, HCCT, BGIT, PMDT, DH"
  }
};