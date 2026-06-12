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
      "title": ""
    },
    "location": "45 Cheonghak-ro, Osan-si, Gyeonggi-do, Hàn Quốc (cách Seoul 35 km về phía Nam )",
    "region": "gyeonggi",
    "intro": "*Trường hàng đầu tỉnh Gyeonggi\n- Tên tiếng Hàn: 오산대학교\n- Tên tiếng Anh: Osan University\n- Năm thành lập: 1978\n- Loại trường: Đại học tư thục\n- Chuyên ngành tiêu biểu:Kỹ thuật, công nghệ\n- Học bổng: Có\n- Website: www.osan.ac.kr/\n- Là trường tư thục tọa lạc tại tỉnh Gyeonggi, với lịch sử phát triển 43 năm và đầu tư vào chất lượng giáo dục là trường Đại học được nhiều du học sinh quốc tế lựa chọn theo học. Với vị trí thuận lợi không quá xa trung tâm cách thủ đô Seoul 35km về phía nam.\n- Trường được thành lập vào năm 1978 với tên gọi Cao đẳng Công nghệ Kỹ thuật Osan.\n- Trường hiện đang đối tác với Cao đẳng Nghề Công nghiệp Hà Nội và Cao đẳng Nghề Công nghề Thành phố Hồ Chí Minh và 1 số trường khác.\n- Xếp thứ 32 trường có tỷ lệ việc làm ở 57,3% theo công của Bộ Giáo dục.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 6,3 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Ngành Kỹ thuật Cơ khí - MECHANICAL ENGINEERING.",
      "Quản lý Marketing và Truyền thông - MARKETING AND COMMUNICATION MANAGEMENT.",
      "Ngành Công nghệ công nghiệp",
      "Ngành Cơ khí"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "- Đi theo diện D2-6 được nhận học bổng của trường giảm 50% trong suốt quá trình học.\n\n- Học phí dự kiến 1.700.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%",
    "insurance": "",
    "ktx": "Sau khi pass Visa: \n•     Các học sinh sẽ ở KTX trong 3 tháng 600.000 KRW/3 tháng và có thể phải chuyển nhà vào 3 tháng tiếp theo có người hỗ trợ tìm nhà ở.\n•     Chi phí sinh hoạt: Khoảng 500.000 KRW/tháng \n•     Chi phí nhà ở: \n-     Tiền cọc nhà: 1.000.000 KRW\n-     Tiền thuê nhà: 400.000 KRW/1 tháng\n-     Lưu ý: đã có học sinh tìm được nhà giá cọc chỉ có 600.000 krw và tiền thuê nhà 280.000 krw/1 tháng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Osan.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng hàn\n\nHồ sơ gửi sang trường bản cứng:",
      "Bảng Điểm CĐ tại VN ( Dịch Công chứng + Dán tem tím  )",
      "Giấy xác nhận SV ( Dịch Công chứng + Dán tem tím  )",
      "Giấy xác nhận nơi sinh CT07 ( Dịch Công chứng )",
      "Giấy cam kết tuân thủ quy định di học ( có mẫu đi kèm )",
      "Giấy xác nhận số dư tài khoản gửi tiết kiệm ngân hàng , sao kê số dư tài khoản tối thiểu 300 triệu VND đứng tên học sinh  (xin ở ngân hàng)\nTrong vòng 1 tháng trước khi nộp hồ sơ",
      "Bản sao Hộ chiếu",
      "Application form ( Theo mẫu của trường )",
      "Giấy khám sức khoẻ lao phổi song ngữ ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa )\nLưu ý: Tất cả các bản đều là dịch công chứng   \n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI\n\n📎 Tài liệu đính kèm: Cam kết tuân thủ của Học sinh - OSAN.docx"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "documents/Induk-University-Catalog-(1).pdf",
      "invoice": "https://drive.google.com/file/d/1AbOCZIBRHMO8LKGGym7lcc4qfcWjNazU/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=VNYkbySK0vg",
      "youtubeId": "VNYkbySK0vg",
      "title": ""
    },
    "location": "12 Choansan-ro, Wolgye‑dong, Nowon‑gu, Seoul 01878, Hàn Quốc",
    "region": "seoul",
    "intro": "Đại học tư thục, dạng cao đẳng – chuyên đào tạo bằng cao đẳng và chứng chỉ nghề chuyên sâu\nDiện tích trường khoảng 76.000 m² (khoảng 7,6 ha).\nGồm khoảng 10 tòa nhà học tập và ký túc xá; có cả trường PTTH công nghệ cùng hệ thống\nKhoảng 8.600 sinh viên; 160 giảng viên chính thức và 290 giảng viên thỉnh giảng\n\nChuyên ngành:\nCó 6 khoa chính: Smart ICT, Smart City, Creative Design, Broadcasting & Culture Contents, Global Business, Physical Education... với tổng cộng 33 ngành học (hai và ba năm)\n\nGiao thông & đi lại\nTàu điện ngầm:\nGa Wolgye – tuyến số 1, ngắn khoảng 5 phút đi bộ tới trường.\nTừ ga Changdong (số 4), chuyển sang số 1 đến Wolgye.\nCách ga Hagye (tuyến 7) một chút, kết nối qua xe buýt \n\nXe buýt: Tuyến 100, 172, 1137, 1140, 1161 dừng ngay trước trường \n\nXe hơi: Dễ tiếp cận từ các tuyến đường cao tốc Đông Bắc và các cầu vượt gần đó",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Khoa Kinh doanh dịch vụ du lịch - DEPARTMENT OF TOURISM & SERVICE MANAGEMENT"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% trong suốt quá trình học cho đến khi tốt nghiệp\n\nHọc phí dự kiến 1.543.500 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 2 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều",
    "insurance": "",
    "ktx": "•  KTX: 4 người/1 phòng( không bao gồm ăn)\nLưu ý: \n- KTX dành cho nữ 200,000 KRW/1 tháng ở trong khuôn viên trường. ( 16 tuần học và 8 tuần nghỉ ).\n- KTX dành cho nam 250,000 KRW/1 tháng, cách trường 20 phút đi tầu. ( 16 tuần học và  8 tuần nghỉ ).\n•  Chi phí nhập học: 214.000 KRW ( Chưa bao gồm tiền chăn gối, sách)\n*  Phí xe buýt đón: 30.000 KRW\n*  Phí đăng ký cư trú: 34.000 KRW\n*  Bảo hiểm: 100.000 KRW\n*  Trải nghiệm văn hóa: 50.000 KRW",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Induk.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường toàn bộ là bản scan:",
      "Application form (Thư đăng ký nhập học)- Theo mẫu (số 1)",
      "Giới thiệu bản thân và kế hoạch du học- Theo mẫu (số 2)",
      "Thư đồng ý cho phép tra cứu học lực- Theo mẫu (số 3)",
      "Thư đồng ý cho phép thu thập và sử dụng thông tin cá nhân- Theo mẫu (số 4)",
      "Giấy bảo lãnh tài chính- Theo mẫu (số 4)",
      "Giấy cam kết - Theo mẫu (số 6)",
      "Giấy xác nhận sinh viên ( Dịch Công chứng / không cần tem tím khi nộp trường  )",
      "Bảng điểm cao đẳng ( Dịch công chứng / không cần tem tím khi nộp trường )",
      "Thư tiến cử (bản gốc) do Hiệu trưởng của Trường cao đẳng cấp ( dịch công chứng )",
      "Bản sao hộ chiếu của học sinh/ bố mẹ ( Dịch công chứng )",
      "Bản sao CCCD của học sinh, bố mẹ ( Dịch công chứng )",
      "Giây khai sinh ( Dịch Công chứng )",
      "Giấy chứng minh quan hệ gia đình ( Sổ hộ khẩu, CT07 , dịch công chứng )",
      "Xác nhân số dư tài khoản 13 triệu won (Sổ đứng tên học sinh, số dư tối thiểu 13 triệu won trở lên \nGiấy chứng nhận được cấp trong vòng 1 tháng trước khi nộp hồ sơ)",
      "Giấy xác nhận nơi công tác, thu nhập và chứng minh tài chính của bố mẹ (Dịch công chứng )",
      "Giấy chứng nhận kết quả TOPIK (nếu có TOPIK 2 trở lên thì nộp)",
      "Ảnh thẻ nền trắng, theo form ảnh hộ chiếu (3 cái).",
      "Giấy khám sức khoẻ lao phổi song ngữ  ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa ) \n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn ).\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "documents/Yeonsung-University-Catalog.pdf",
      "invoice": "https://drive.google.com/file/d/1KrIVtDkD_siHLxkqTI7wSdVtxBc6SASZ/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=ICVUWdCIUU4",
      "youtubeId": "ICVUWdCIUU4",
      "title": ""
    },
    "location": "Địa chỉ: 34 Yanghwa-ro 37beon-gil, Manan-gu, Anyang-si, Gyeonggi-do, Hàn Quốc\n\nNằm tại quận Manan, thành phố Anyang (Gyeonggi), thuộc vùng thủ đô Seoul – kết nối thuận tiện bằng tàu, xe buýt, có shuttle bus từ ga Anyang .",
    "region": "gyeonggi",
    "intro": "- Tên tiếng Hàn: 연성대학교\n- Tên tiếng Anh: Yeonsung University\n\nThành lập:\n- 15/3/1977 – bắt đầu là Anyang Industrial Technical School\n- 1979 chuyển thành trường cao đẳng kỹ thuật\n- 1998 đổi tên thành Anyang Science University\n- 1/5/2012 – đổi tên chính thức thành Yeonsung University \nLoại hình: Tư thục, cao đẳng nghề chuyên biệt (junior college) .\nQuy mô (2018): khoảng 5.800 sinh viên; ~156 giảng viên chính quy và 300 giảng viên thỉnh giảng\n\nKhuôn viên: Diện tích khoảng 202.000 m², gồm thư viện, 9 tòa nhà học thuật, ký túc xá, nhiều phòng lab chuyên ngành & phòng thực hành, sân thể thao .\nTiện ích: Quầy cà phê (Gem Café), căng-tin, food court, career lounge, maker space, VR/STUDIO/CS studio, hội trường, shuttle bus… \nDịch vụ sinh viên: Tư vấn nghề nghiệp – học tập cá nhân hóa (AI), hỗ trợ tâm lý, thiết kế portfolio, chuẩn bị xin việc .\nCải thiện chất lượng: Năm 2023, cải tổ đa dạng thực đơn căn tin (từ 2 lên ~40 món/phục vụ) sau hiệu ứng truyền thông \n\nLiên kết với hơn 43 trường đối tác tại 14 quốc gia – châu Âu, châu Á, Mỹ... nhằm trao đổi học thuật, thực tập quốc tế .\nĐịnh hướng nghề nghiệp gắn liền với doanh nghiệp qua chương trình P-TECH, tích hợp kỹ năng thực tiễn và chuyển tiếp nghề nghiệp",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Điện - điện tử - ELECTRICAL AND ELECTRONICS ENGINEERING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên \nHọc phí dự kiến 1.600.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 1 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 3 đến 4 tiếng",
    "insurance": "",
    "ktx": "- KTX nằm ngoài khuôn viên trường\n- Giá giao động 1.650.000 KRW/6 tháng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Yeonsung.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form (Thư đăng ký nhập học) - Theo mẫu (số 1)",
      "Giới thiệu bản thân và kế hoạch du học -        - Theo mẫu (số 2)",
      "Giấy bảo lãnh chi phí du học- Theo mẫu (số 3)",
      "Thư tiến cử (bản gốc) do hiệu trưởng của Trường cao đẳng cấp ( Dịch Công chứng )",
      "Giấy xác nhận sinh viên ( Dịch Công chứng / không cần tem tím khi nộp trường/ )",
      "Bảng điểm cao đẳng ( Dịch Công chứng/  không cần tem tím khi nộp trường )",
      "Bản sao hộ chiếu của học sinh/ bố mẹ",
      "Bản sao CCCD/hộ chiếu của bố mẹ",
      "Giấy khai sinh ( Dịch Công chứng )",
      "Sổ hộ khẩu (giấy chứng minh quan hệ gia đình) CT07 ( Dịch công chứng)",
      "Giấy xác nhận số dư tài khoản trên 13 triệu won (Giấy chứng nhận số dư phát hành trong vòng 1 tháng trước khi nộp hồ sơ).",
      "Giấy xác nhận đang công tác hoặc chứng minh được thu nhập của bố mẹ",
      "ảnh hộ chiếu nền trắng 3 st ( 3,5*4,5)",
      "Giấy khám sức khoẻ lao phổi song ngữ ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa ) \n\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1U79U2e7tqad3s4rHVBWOh1v7-bqe4Y76/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=umdE4TXwaXI",
      "youtubeId": "umdE4TXwaXI",
      "title": ""
    },
    "location": "20 Hongjimun 2-gil, Jongno-gu, Seoul 03016, Hàn Quốc (Campus Seoul) | 31 Sangmyungdae-gil, Cheonan-si, Chungcheongnam-do (Campus Cheonan)",
    "region": "seoul",
    "intro": "- Tên tiếng Hàn: 상명대학교\n- Tên tiếng Anh: Sangmyung University\n- Năm thành lập: 1937\n- Loại hình: Đại học tư thục 4 năm\n- Quy mô: ~13.000 sinh viên\n- Website: www.smu.ac.kr\n\nSangmyung University là trường đại học tư thục uy tín tại Hàn Quốc với lịch sử hơn 80 năm. Trường có 2 campus: Seoul (Jongno-gu) và Cheonan (Chungnam). Campus Seoul nằm ngay trung tâm thành phố, gần Gyeongbokgung và Changdeokgung, thuận tiện di chuyển bằng metro.\n\nTrường nổi tiếng với các ngành Nghệ thuật, Công nghệ thông tin, Kinh doanh và Khoa học xã hội. Tỷ lệ có việc làm sau tốt nghiệp cao, đặc biệt các ngành kỹ thuật và thiết kế.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong 2b"
    ],
    "majors": [
      "Kinh doanh quốc tế - INTERNATIONAL BUSINESS",
      "Công nghệ thông tin - INFORMATION TECHNOLOGY",
      "Thiết kế - DESIGN"
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% kỳ đầu\nHọc phí dự kiến: 1.800.000 - 2.200.000 KRW/kỳ (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 350.000 - 500.000 KRW/tháng\nNhà thuê gần trường: 300.000 - 450.000 KRW/tháng",
    "schedule": "",
    "advantages": [
      "Đại học 4 năm uy tín, bằng cấp được công nhận rộng rãi",
      "Không đóng băng tài chính",
      "Tỷ lệ chuyển đổi E7 rất tốt sau khi tốt nghiệp",
      "Campus Seoul - vị trí đắc địa trung tâm thủ đô",
      "Nhiều cơ hội làm thêm tại Seoul",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Anh/Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1koKmGXVjZmSBtiSRcqaMuf3blbO_w4W0/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/15_g8BgeSQAyDkqLAFCz8XE04mnXcjeX0/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Vup7-eqakBE",
      "youtubeId": "Vup7-eqakBE",
      "title": ""
    },
    "location": "63 Gyeyangsan-ro, Gyesan-dong, Gyeyang-gu, Incheon, Hàn Quốc",
    "region": "incheon",
    "intro": "- Tên tiếng anh: Kyungin Women’s University (KIWU).\n- Tên tiếng Hàn: 경인여자대학교\n- Năm thành lập: Năm 1992.\n- Loại hình: tư thục.\n- Số sinh viên: khoảng 4.500\n- Điện thoại: 031-540-0114\n- Website: https://www.kiwu.ac.kr/\n\n1: Top 3 Nữ sinh Incheon & Visa thẳng: Thành lập năm 1992 tại Incheon, Đại học Nữ sinh Kyungin là trường tư thục hàng đầu dành cho nữ sinh tại Hàn Quốc, xếp top 3 trường nữ sinh tốt nhất Incheon. Trường được Bộ Giáo dục Hàn Quốc công nhận là “Đại học Xuất sắc” (2014-2020) và thuộc top 1% visa thẳng (2018), giúp sinh viên Việt Nam nhập học dễ dàng mà không cần phỏng vấn hay đóng băng tài khoản 10,000 USD.\n2: Vị trí chiến lược: Tọa lạc tại Incheon, gần sân bay quốc tế Incheon (~30 phút), KIWU nằm trong khu vực sầm uất với trung tâm thương mại lớn nhất Hàn Quốc và chi phí sinh hoạt thấp hơn Seoul (~60-70%). Incheon cách Seoul ~40 phút tàu điện, thuận tiện di chuyển. Cộng đồng sinh viên quốc tế tại đây khoảng 300 người, trong đó ~100 sinh viên Việt Nam (2023).\n3: Thế mạnh đào tạo: KIWU nổi bật với các ngành phù hợp nữ giới: \n- Điều dưỡng: Xếp hạng A về đào tạo (2018), hợp tác với các bệnh viện lớn.\n- Giáo dục mầm non: Đào tạo giáo viên mầm non hơn 30 năm.\n- Làm đẹp: Mỹ phẩm, Thẩm mỹ, Quản lý spa.\n- Thư ký & Kế toán thuế.\n- Du lịch & Khách sạn: Quản lý sự kiện, Dịch vụ hàng không. Trường có 4 khoa (Xã hội, Sức khỏe, Văn hóa, Kinh doanh) với hơn 20 chuyên ngành. Các chương trình giảng dạy kết hợp thực hành, đảm bảo tỷ lệ việc làm sau tốt nghiệp lên đến 80% (2018).",
    "conditions": [
      "Dưới 25 tuổi",
      "Chỉ dành cho nữ",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong2b ( Fastgo có hỗ trợ Sejong2b) - Với kỳ tháng 3/2026 không yêu cầu chứng chỉ tiếng"
    ],
    "majors": [
      "Điều Dưỡng - Nursing ( 간호학과)"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng.",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Với D2-6 học kỳ đầu tiên: 1.480.000 Krw",
    "insurance": "",
    "ktx": "300.000 KRW/1 tháng",
    "schedule": "",
    "advantages": [
      "Không đóng băng tài chính",
      "Cam kết tỉ lệ visa cực cao",
      "Linh động chọn ngành học khi lên D2-1",
      "Thu nhập làm thêm lên tới 40 triệu đồng/ tháng",
      "Lên D22 cần Topik 3/Hoặc hoàn thành 100h tiếng Hàn",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Làm tiếng Hàn.\n\nHồ sơ gửi trường sau PV scan:",
      "Application",
      "Giấy xác nhận sinh viên của trường đại học/cao đẳng đang theo học  (Tem Tím)",
      "Bảng điểm học tập chính thức ( Tem Tím )",
      "Bằng tốt nghiệp + Học bạ ( Dịch công chứng )",
      "Bản sao hộ chiếu ( Dịch Công chứng )",
      "Phiếu thông tin về trình độ tiếng Hàn ( Chứng chỉ TOPIK hoặc SEJONG nếu có )",
      "03 ảnh thẻ cỡ 3x4 (mặt chính diện)",
      "Xác nhân số dư sổ tiết kiệm sổ 17.000.000 KRW đứng tên học sinh\n\nSổ chứng minh tài chính khi nộp xin Visa ( Sổ gốc )\n- Mở sổ tài khoản 250 triệu.\n- Thời hạn sổ 1 năm\n- Đứng tên học sinh\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn ).\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á VÀ NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "documents/Dongnam-University-Catalog-.pdf",
      "invoice": "https://drive.google.com/file/d/1cQt0uqhosBjyHgX4UuAPaF__6WjRIpEu/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=2JCs1paO_Zo",
      "youtubeId": "2JCs1paO_Zo",
      "title": ""
    },
    "location": "Địa chỉ: 50 Cheoncheon‑ro 74‑gil, Jeongja‑dong, Jangan‑gu, Suwon‑si, Gyeonggi‑do, Hàn Quốc\n\nNằm ở phía bắc Suwon, trên bờ sông Seohocheon, trong khu vực đô thị thuận tiện di chuyển bằng bus và đi tới Seoul rất dễ dàng",
    "region": "gyeonggi",
    "intro": "- Tên tiếng Hàn: 동남보건대학교\n- Tên tiếng Anh: Dongnam Health University\n\nThành lập:\nNgày 19/12/1973 dưới tên Dongnam Health Junior School \nTrở thành trường cao đẳng năm 1979, đổi tên thành đại học vào năm 1998 và 2012.\nLoại hình: Đại học chuyên đào tạo chuyên môn, tư thục.\nLãnh đạo hiện nay: Chủ tịch Lee Young Kwon (이영권) \nQuy mô (đến 2023): khoảng 4.685 sinh viên, 122 giảng viên chính quy và 258 giảng viên thỉnh giảng\n\nCơ sở: 9 tòa nhà học thuật gần công viên Jeongja, thư viện, phòng lab, ký túc xá, thư viện kỹ thuật cao cấp \nHoạt động được cấp phép:\nĐược Bộ Giáo dục Hàn Quốc chọn là trường chất lượng (2 đợt hỗ trợ đổi mới), đạt chứng nhận đào tạo điều dưỡng y tế .\nTrường thuộc nhóm được cấp “giấy chứng nhận chất lượng giáo dục nghề” \n\nTỷ lệ sinh viên/giảng viên: ~38 sinh viên cho mỗi giảng viên chính quy.\nTài chính & bộ hỗ trợ: Kinh phí trung bình đào tạo một sinh viên ~937.000 KRW/năm; nhận hỗ trợ từ chính phủ giai đoạn 2022–2024 .\nXếp hạng học thuật:\nTheo AD Scientific Index (2025): xếp #240 tại Hàn Quốc, #10.113 châu Á, 18.687 thế giới",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Chăm sóc sắc đẹp - BEAUTY CARE",
      "Quản lý du lịch y tế - MEDICAL TOURISM MANAGEMENT"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "1. Ngành : QUẢN TRỊ DỊCH VỤ DU LỊCH Y TẾ : \nĐi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên \nHọc phí dự kiến: 1.594.300KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%",
    "insurance": "",
    "ktx": "",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Osan.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 5 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường toàn bộ là bản scan:",
      "Application form (Thư đăng ký nhập học) & thư đồng ý thu thập thông tin cá nhân - Theo mẫu của trường",
      "Giấy chứng nhận sinh viên (dịch công chứng)",
      "Bảng điểm tại trường Cao đẳng (dịch công chứng)",
      "Chứng chỉ ngoại ngữ (TOPIK ko bắt buộc) (nếu có TOPIK 2 hoặc SEJONG 2B trở lên thì nộp)",
      "Bản sao hộ chiếu của học sinh và bố mẹ",
      "Bản sao CCCD của học sinh và bố mẹ (dịch công chứng)",
      "Giấy khai sinh ( Dịch công chứng )",
      "CT07 (giấy chứng minh quan hệ gia đình) ( Dịch Công chứng )",
      "Giấy chứng minh tài chính (Chứng minh thu nhập của bố mẹ - Dịch Công chứng)",
      "Xác nhân số dư tương đương 18 triệu KRW đứng tên học sinh  (bản sao sổ tiết kiệm và giấy xác nhận số dư) Trong vòng 1 tháng trước khi nộp hồ sơ",
      "Nền trắng, ảnh hộ chiếu ( 3 ảnh 3,5*4,5)\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1OvD9XCX6dLBaIR6IKTdgtnfoT-Op3gU-/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1mo1sCUbmhxxrZlprtSNmh5KibJQYJR8e/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=xqT-_-3l8Yk",
      "youtubeId": "xqT-_-3l8Yk",
      "title": ""
    },
    "location": "176 Eomgwang-ro, Gaya 3(sam)-dong, Busanjin-gu, Busan, Hàn Quốc",
    "region": "busan",
    "intro": "Tên tiếng Hàn: 동의대학교\nTên tiếng Anh: Dong-Eui University\nNăm thành lập: 1977\nLoại hình: Đại học tư thục hệ 4 năm\nĐịa điểm: Thành phố Busan, Hàn Quốc\nCơ sở:\nGaya Campus: 176 Eomgwangno, Busanjin-gu, Busan\nYangjeong Campus: 100 Jinri 1-ro, Busanjin-gu, Busan\nWebsite: deu.ac.kr\nTrường nằm tại trung tâm \nthành phố Busan\n\nCách biển Gwabggalli và Haeundae khoảng 30 phút đi tầu điện ngầm\n\nGần sân bay quốc tế Gimhae - chỉ mất 40 phút di chuyển",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ Topik 2 hoặc Sejong2b ( Fastgo có hỗ trợ Sejong2b)"
    ],
    "majors": [
      "Kỹ thuật cơ khí - MECHANICAL ENGINEERING",
      "Quản lý du lịch quốc tế - INTERNATIONAL TOURISM MANAGEMENT",
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Kỹ thuật ô tô - AUTOMOTIVE ENGINEERING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm.",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Với D2-6 học phí năm đầu tiên : 1.800.000 KRW/1 năm ( Học bổng 100% kỳ đầu tiên )\n\nTất cả học kỳ học phí khi lên chuyên ngành giao động 1.800.000 krw > 3.000.000 Krw/1 kỳ tùy khoa đăng ký theo học",
    "insurance": "",
    "ktx": "KTX chỉ từ 150.000 KRW/1 tháng\n\nTặng kèm 100 xuất ăn miễn phí - Có thể nhiều hơn - Mỗi xuất giá 5000 won",
    "schedule": "",
    "advantages": [
      "Nhận ngay học bổng toàn 100% kỳ đầu tiên khi đăng ký tham gia chương trình trị giá 1.800.000 krw.",
      "Không đóng băng tài chính",
      "Cam kết tỉ lệ visa cực cao",
      "Linh động chọn ngành học khi lên D2-2",
      "Nhiều việc làm, thu nhập làm thêm lên tới 40 triệu đồng/ tháng",
      "Lên D22 cần Topik 3/Hoặc hoàn thành 100h tiếng Hàn",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Làm tiếng anh\n\nHồ sơ gửi trường sau PV bản cứng:",
      "Đơn đăng ký chương trình sinh viên trao đổi",
      "Giấy xác nhận sinh viên của trường đại học hoặc cao đẳng đang theo học  (Dịch Công chứng)",
      "Bảng điểm học tập chính thức ( Dịch Công chứng )",
      "Giấy khám lao phổi ( 2 bản: 1 bản nộp trường + 1 bản nộp ĐSQ xin Visa ) \n(Có thể yêu cầu thêm kiểm tra sức khỏe nếu ở ký túc xá)",
      "Bản sao hộ chiếu ( Dịch Công chứng )",
      "Phiếu thông tin về trình độ tiếng Hàn ( Chứng chỉ TOPIK hoặc SEJONG nếu có )",
      "Thư giới thiệu của Hiệu trưởng trường Đại học/Cao đẳng học sinh theo học - Fastgo cung cấp ( Dịch Công chứng )",
      "03 ảnh thẻ cỡ 3x4 (mặt chính diện)",
      "Xác nhân số dư sổ tiết kiệm sổ 17.000.000 KRW đứng tên học sinh\n\nSổ chứng minh tài chính khi nộp xin Visa ( Sổ gốc )\n- Mở sổ tài khoản 250 triệu.\n- Thời hạn sổ 1 năm\n- Đứng tên học sinh\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn ).\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á VÀ NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1xVMO320agblD8atS_Mvj8jFenFePBDOz/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1qcyCKMkHSUhwHmKkycw2qEiyHZf_-mhA/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=DnVeaZaVpHA",
      "youtubeId": "DnVeaZaVpHA",
      "title": ""
    },
    "location": "17 Jeildaehak-gil, Deogwol-dong, Suncheon-si, Jeollanam-do, 57997, Hàn Quốc",
    "region": "jeollanam",
    "intro": "- Tên tiếng Hàn: 순천제일　\n- Tên tiếng Anh: Suncheon Jeil College\n\nThành lập: Năm 1978–1979 (ban đầu là Cao đẳng Kỹ thuật), đổi tên thành Suncheon Jeil College từ năm 1998–2012 \nstudyinkorea.go.kr\n\nLoại hình: Tư thục, cao đẳng chuyên đào tạo nghề.\n\nQuy mô: Hơn 4.000 sinh viên; hơn 200 giảng viên\n\nHệ Cao đẳng\nCó nhiều khoa: Kỹ thuật (xây dựng, điện tử, ô tô…), Khoa học tự nhiên, Y tế & Phúc lợi, Nghệ thuật & Dịch vụ…",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Khoa pha chế cà phê và khoa học ẩm thực - DEPARTMENT OF COFFEE BARISTA AND CULINARY SCIENCE",
      "Đa phương tiện - MULTI MEDIA",
      "Công nghệ – Công nghiệp         - TECHNOLOGY – INDUSTRY",
      "Kỹ thuật cơ khí & ô tô - MECHANICAL & AUTOMOTIVE ENGINEERING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% trong suốt quá trình học cho đến khi tốt nghiệp\n\nHọc phí dự kiến 1.600.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 1 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 1 đến 2 tiếng\n\nLưu ý: Khi nhập cảnh sang trường - Học sinh phải đóng 800.000 won phí đăng ký cho trường bằng tiền mặt",
    "insurance": "",
    "ktx": "- Dự kiến : 1.000.000 KRW/5 tháng\n- Sẽ có Invoice sau khi đỗ phỏng vấn trường",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Suncheon Jeil.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application viết tay\n- Tiếng Hàn \n\nHồ sơ gửi sang trường toàn bộ là bản Scan:",
      "Bản sao hộ chiếu và 03 ảnh 3.5 * 4.5 ( ảnh nền trắng)",
      "Bằng tốt nghiệp THPT ( Dịch công chứng )",
      "Giấy chứng nhận sinh viên ( Dịch công chứng )",
      "Bảng điểm tại trường Cao Đẳng ( Dịch Công chứng )",
      "Giấy chứng minh tài chính 6 tháng gần nhất ( Bản khai thu nhập, CM thu nhập, giấy đăng ký kinh doanh ...)\n- Cần bản khai thu nhập và giấy chứng minh thu nhập của bố mẹ\n- Tài liệu bao gồm: nghề nghiệp, thu nhập, địa chỉ nơi làm việc, số điện thoại, chức vụ, v.v.\n- Đối với chủ hộ kinh doanh: giấy đăng ký kinh doanh, báo cáo thuế, v.v.\n- Phải nộp ảnh chụp thực tế nơi làm việc (xưởng sản xuất, cửa hàng, v.v.)\"",
      "Giâý xác nhận số dư tài khoản ngân hàng 6 tháng 16.000.000 KRW trở lên \n-  Sao kê ngân hàng 3>6 tháng gần nhất \n- Có thể sử dụng tài khoản của học sinh hoặc bố mẹ\n- Phải được phát hành trong vòng 30 ngày gần nhất và có xác nhận từ ngân hàng",
      "CT07 chứng nhận quan hệ gia đình ( Dịch công chứng )",
      "Bản sao CCCD bô/mẹ ( Dịch công chứng )",
      "Giấy khai sinh học sinh ( Dịch công chứng )",
      "Application form ( Viết tay )",
      "Chứng chỉ ngoại ngữ nếu có ( TOPIK 2 hoặc SEJONG 2B trở lên )\n\nLưu ý sổ nộp ĐSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "title": ""
    },
    "location": "Địa chỉ: 516 đường Jinman , Phường Yangjeong, quận Busanjin, Busan, Hàn Quốc\n\nTọa lạc tại vị trí chiến lược giáp Seomyeon, trung tâm Busan thành phố lớn thứ 2 tại Hàn Quốc ( dưới 10 phút di chuyển)",
    "region": "busan",
    "intro": "- Tên tiếng Hàn: 부산여자대학교\n- Tên tiếng Anh: Busan Women's College \n\nThành lập: năm 1969 Trường Nữ Sinh Busan Hàn Quốc được thành lập với tên gọi đầu tiên là Trường Trung học Nữ Busan.\nNăm 2012 trường được đổi tên thành Cao Đẳng Nữ Sinh Busan.\n\nLoại hình:  tư thục\nQuy mô: ~2877 sinh viên\nGiáo sư  và cán bộ nhân viên: 290 giáo sư \n\nWebsite: https: http://www.bwc.ac.kr\n \nTrong suốt quá trình gần 60 năm hình thành và phát triển, trường đã mở rộng các chương trình đào tạo bao gồm các ngành như giáo dục mần non, du lịch, khách sạn, y tế và phúc lợi xã hội. \n\n. Xếp thứ hạng 171/193 TOP trường Đại học / Cao đẳng Hàn Quốc.\n. Xếp hạng 9676/14131 trường Đại học/ Cao đẳng trên toàn thế giới.\nSố lượng sinh viên đang theo học ~ 3.000 sinh viên.\n\nTừ năm 2011~ 2012 trường được Bộ Giáo Dục, khoa học công nghệ Hàn Quốc bình chọn tham gia thí điểm Dự Án Tăng Cường Năng Lực Giáo Dục Cao Đẳng.\n\nTrung tâm Hỗ trợ việc làm và khởi nghiệp tại trường cung cấp nhiều thông tin bổ ích về nghề nghiệp , việc làm và thông tin khởi nghiệp cho sinh viên.\nNăm 2021, Viện Đánh Giá Và Chứng Nhận Đào Tạo Nghề chứng nhậ Cao Đẳng Nữ Busan là Cao Đẳng có chất lượng đào tạo nghề Cao Cấp.\n\n. Thông qua Trung tâm Tư Vấn Đời Sống Sinh Viên, nhà trường tổ chức các buổi tư vấn tâm lý giúp sinh viên giải quyết nhanh chóng các vấn đề và mối quan tâm của mình.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên \nHọc phí dự kiến 1.618.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\nTiền bảo hiểm: 80,000 KRW\n\n1 Tuần chỉ phải học 1 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 3 đến 4 tiếng",
    "insurance": "",
    "ktx": "720,000 KRW/6 tháng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Yeonsung.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form (Thư đăng ký nhập học) - Theo mẫu (số 1)",
      "Giới thiệu bản thân và kế hoạch du học -        - Theo mẫu (số 2)",
      "Giấy bảo lãnh chi phí du học- Theo mẫu (số 3)",
      "Thư tiến cử (bản gốc) do hiệu trưởng của Trường cao đẳng cấp ( Dịch Công chứng )",
      "Giấy xác nhận sinh viên ( Dịch Công chứng / không cần tem tím khi nộp trường/ )",
      "Bảng điểm cao đẳng ( Dịch Công chứng/  không cần tem tím khi nộp trường )",
      "Bản sao hộ chiếu của học sinh/ bố mẹ",
      "Bản sao CCCD/hộ chiếu của bố mẹ",
      "Giấy khai sinh ( Dịch Công chứng )",
      "Sổ hộ khẩu (giấy chứng minh quan hệ gia đình) CT07 ( Dịch công chứng)",
      "Giấy xác nhận số dư tài khoản trên 13 triệu won (Giấy chứng nhận số dư phát hành trong vòng 1 tháng trước khi nộp hồ sơ).",
      "Giấy xác nhận đang công tác hoặc chứng minh được thu nhập của bố mẹ",
      "ảnh hộ chiếu nền trắng 3 st ( 3,5*4,5)",
      "Giấy khám sức khoẻ lao phổi song ngữ ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa ) \n\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1c4XfGO424-5OINQI9YuaCNPYY4WXNeaC/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Uw413FDFQG8",
      "youtubeId": "Uw413FDFQG8",
      "title": ""
    },
    "location": "57 Oesolsun-ro 303beon-gil, Geumjeong-gu, Busan 46252, Hàn Quốc\nNằm tại quận Geumjeong, thành phố Busan - gần núi Geumjeongsan, cách trung tâm Busan 20 phút tàu điện",
    "region": "busan",
    "intro": "- Tên tiếng Hàn: 부산가톨릭대학교\n- Tên tiếng Anh: Catholic University of Busan\n- Năm thành lập: 1964\n- Loại hình: Đại học tư thục Công giáo\n- Quy mô: ~5.000 sinh viên\n- Website: www.cup.ac.kr\n\nĐại học Công giáo Busan là trường đại học tư thục được thành lập bởi Giáo phận Công giáo Busan. Trường nổi tiếng với các ngành Khoa học Y tế, Điều dưỡng, Xã hội học và Công nghệ thông tin. Môi trường học tập kỷ luật, yên tĩnh, hỗ trợ sinh viên quốc tế tốt.\n\nTrường có tỷ lệ việc làm sau tốt nghiệp cao, đặc biệt trong lĩnh vực y tế và phúc lợi xã hội tại khu vực Busan.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Phúc lợi xã hội - SOCIAL WELFARE",
      "Công nghệ thông tin - INFORMATION TECHNOLOGY"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên\nHọc phí dự kiến: 1.550.000 KRW/6 tháng (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 250.000 - 350.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình",
      "Không đóng băng tài chính",
      "Không Phỏng Vấn ĐSQ",
      "Tỷ lệ đỗ cao nếu có Topik 2 hoặc Sejong 2b",
      "Busan - thành phố lớn thứ 2 Hàn Quốc, nhiều cơ hội việc làm",
      "Được đi làm thêm sau khi có chứng minh thư",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giới thiệu bản thân và kế hoạch du học - Theo mẫu",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1Yy3ceBqYGYelV-tmfAl-9ZVprNvctmhN/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=FTKBjPUMesA",
      "youtubeId": "FTKBjPUMesA",
      "title": ""
    },
    "location": "112 Hallim-ro, Hallim-myeon, Gimhae-si, Gyeongsangnam-do 50983, Hàn Quốc\nThành phố Gimhae, tỉnh Gyeongnam - cách sân bay quốc tế Gimhae (Busan) khoảng 20 phút, cách trung tâm Busan 40 phút",
    "region": "gyeongsangnam",
    "intro": "- Tên tiếng Hàn: 김해대학교\n- Tên tiếng Anh: Gimhae College\n- Năm thành lập: 1993\n- Loại hình: Cao đẳng tư thục\n- Quy mô: ~3.500 sinh viên\n- Website: www.gimhae.ac.kr\n\nGimhae College tọa lạc tại thành phố Gimhae, vùng Gyeongnam - khu công nghiệp lớn của miền Nam Hàn Quốc. Trường chuyên đào tạo các ngành kỹ thuật, công nghệ và dịch vụ gắn với nhu cầu thực tế của các khu công nghiệp Gimhae và Busan.\n\nVị trí gần sân bay Gimhae và các khu công nghiệp lớn tạo điều kiện thuận lợi cho sinh viên tìm việc làm thêm và thực tập. Chi phí sinh hoạt tại Gimhae thấp hơn Busan khoảng 20-30%.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Kỹ thuật cơ khí - MECHANICAL ENGINEERING",
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Công nghệ ô tô - AUTOMOTIVE TECHNOLOGY",
      "Điện - điện tử - ELECTRICAL AND ELECTRONICS"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên\nHọc phí dự kiến: 1.400.000 KRW/6 tháng (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 200.000 - 300.000 KRW/tháng\n4-6 người/phòng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình",
      "Không đóng băng tài chính",
      "Không Phỏng Vấn ĐSQ",
      "Tỷ lệ đỗ cao nếu có Topik 2 hoặc Sejong 2b",
      "Gần sân bay Gimhae - thuận tiện di chuyển",
      "Gần khu công nghiệp lớn - nhiều việc làm thêm",
      "Chi phí sinh hoạt thấp so với Seoul/Busan",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giới thiệu bản thân và kế hoạch du học",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
    "region": "gwangju",
    "intro": "- Tên tiếng Hàn: 광주대학교\n- Tên tiếng Anh: Gwangju University\n- Năm thành lập: 1981\n- Loại hình: Đại học tư thục 4 năm\n- Quy mô: ~8.000 sinh viên\n- Website: www.gwangju.ac.kr\n\nGwangju University là trường đại học tư thục lớn tại thành phố Gwangju, trung tâm văn hóa và giáo dục của vùng Honam. Trường có hơn 40 chuyên ngành thuộc các lĩnh vực kỹ thuật, kinh doanh, y tế, nghệ thuật và khoa học xã hội.\n\nThành phố Gwangju là một trong những đô thị phát triển mạnh về công nghiệp ô tô (Kia Motors) và điện tử (LG), cung cấp nhiều cơ hội việc làm thêm cho sinh viên. Chi phí sinh hoạt thấp hơn Seoul 40-50%.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Công nghệ thông tin - INFORMATION TECHNOLOGY",
      "Kỹ thuật công nghiệp - INDUSTRIAL ENGINEERING",
      "Điều dưỡng - NURSING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên\nHọc phí dự kiến: 1.700.000 - 2.000.000 KRW/kỳ (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 250.000 - 380.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình",
      "Không đóng băng tài chính",
      "Không Phỏng Vấn ĐSQ",
      "Đại học 4 năm, bằng cấp giá trị cao",
      "Thành phố Gwangju - chi phí sinh hoạt thấp",
      "Gần các khu công nghiệp Kia, LG - nhiều việc làm thêm",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giới thiệu bản thân và kế hoạch du học",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
    "region": "gwangju",
    "intro": "- Tên tiếng Hàn: 남부대학교\n- Tên tiếng Anh: Nambu University\n- Năm thành lập: 1994\n- Loại hình: Đại học tư thục 4 năm\n- Quy mô: ~5.000 sinh viên\n- Website: www.nambu.ac.kr\n\nNambu University (Đại học Phương Nam) là trường đại học tư thục tại Gwangju, Hàn Quốc. Trường tập trung đào tạo các ngành Công nghệ, Khoa học sức khỏe, Nghệ thuật và Kinh doanh. Nổi bật với chương trình hỗ trợ sinh viên quốc tế và tỷ lệ visa D2 tốt.\n\nGần sân bay Gwangju và Khu công nghệ cao Gwangju - cơ hội thực tập và làm thêm dồi dào trong các ngành điện tử quang học.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Kỹ thuật công nghiệp - INDUSTRIAL ENGINEERING",
      "Công nghệ thực phẩm - FOOD TECHNOLOGY",
      "Thiết kế - DESIGN"
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên\nHọc phí dự kiến: 1.500.000 - 1.800.000 KRW/kỳ (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 200.000 - 320.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình",
      "Không đóng băng tài chính",
      "Không Phỏng Vấn ĐSQ",
      "Đại học 4 năm, chi phí học phí và sinh hoạt thấp",
      "Gần sân bay Gwangju",
      "Môi trường học tập hỗ trợ sinh viên quốc tế tốt",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giới thiệu bản thân và kế hoạch du học",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
      "catalog": "https://drive.google.com/file/d/1UY4eFsyTNxAiOxseN5Ofxu5hfPNGE_P5/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=Qcui82cohB4",
      "youtubeId": "Qcui82cohB4",
      "title": ""
    },
    "location": "Địa chỉ: 316 Daehak-ro, Sinwol-dong, Jecheon, tỉnh Chungcheongbuk, Hàn Quốc\n\nVị trí : Thành phố Jecheon, tỉnh Bắc Chungcheong, Hàn Quốc. (cách thủ đô Seoul khoảng 2 giờ tàu điện)",
    "region": "chungcheongbuk",
    "intro": "- Tên tiếng Hàn: 대원대학교\n- Tên tiếng Anh: Daewon  College\n\nThành lập: năm 1995\n\nLoại hình:  tư thục\n\nQuy mô: ~3.000 sinh viên \nGiáo sư  và cán bộ nhân viên: 92 giáo sư, 50 nhân viên \nWebsite: https://www.daewon.ac.kr/mbs/daewon/\n \nVới không gian campus rộng rãi, thoáng mát có tộng cộng 23 khoa ( chuyên ngành ) và hơn 3000 học sinh đang theo học.\nTrường cung cấp các dịch vụ hỗ trợ học tập, tư vấn nghề nghiệp, hỗ trợ tìm việc làm và hoạt động thực tập gắn với doanh nghiệp nhằm giúp sinh viên chuẩn bị tốt cho việc ra trường và tìm việc. Nhiều chương trình hướng nghiệp, workshop và tư vấn CV được tổ chức thường xuyên\n\nChất lượng & cải tiến: \nTrong gần 30 năm hoạt động, Daewon College luôn đổi mới chương trình đào tạo, chú trọng thực hành kỹ năng và gắn kết với nhu cầu thị trường lao động. Tỷ lệ sinh viên có việc làm sau tốt nghiệp khá cao nhờ hệ thống kết nối doanh nghiệp và chương trình đào tạo ứng dụng.\n\nLiên kết quốc tế:\nTrường có nhiều cơ hội hợp tác và trao đổi học thuật, thực tập với các tổ chức, doanh nghiệp trong và ngoài nước (đa phần tập trung vào thực hành nghề và kết nối việc làm).\n\nĐịnh hướng nghề nghiệp:\nĐịnh hướng đào tạo của Daewon College luôn gắn liền với nhu cầu thực tế của doanh nghiệp và thị trường lao động.\nHỗ trợ việc làm theo diện E-7 liên kết trực tiếp với Công ty Samsung  Heavy Industries\nHội đồng công ty đối tác nội bộ Công ty HD Huyndai Heavy Industries.\nCác Công ty nguyên vật liệu Jecheon ( lljin Global, INFAC, YuYu Pharma .....\n\nNăm 2000 trường được Cục quản lý Doanh nghiệp Vừa và nhỏ chỉ định là Trường trị doanh nghiệp Vừa và Nhỏ ( TRITAS), và được Bộ giáo dục chọn làm trường đại học cơ sở cho các dự án chuyên ngành và ngành công nghiệp địa phương.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 ( GPA 5,0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Điện - điện tử - ELECTRICAL AND ELECTRONICS ENGINEERING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2-1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên \nHọc phí dự kiến 1.100.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 1 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 3 đến 4 tiếng, có thể học Online không cần lên trường",
    "insurance": "",
    "ktx": "750,000KRW /1 kỳ",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình trao đổi sinh viên của trường Yeonsung.",
      "Không đóng băng tài chính ( Không mở sổ Kstudy ).",
      "Không Phỏng Vấn ĐSQ.",
      "Tỷ lệ đỗ gần như tuyệt đối nếu có chứng chỉ tiếng Topik 2 hoặc Sejong 2b.",
      "Học phí rẻ.",
      "Được đi làm thêm ngay, cam kết hỗ trợ việc làm thêm, lương trung bình 40 triệu/1 tháng, thời gian làm thêm 5h/1 ngày, ngày nghỉ và lễ tết không giới hạn",
      "Thời gian học trong tuần ít chỉ từ 3 buổi/1 tuần.",
      "Hỗ trợ chuyển đổi Visa sau khi tốt nghiệp sáng E7.",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form (Thư đăng ký nhập học) - Theo mẫu (số 1)",
      "Thư tiến cử (bản gốc) do hiệu trưởng của Trường cao đẳng cấp ( Dịch Công chứng )",
      "Giấy xác nhận sinh viên ( Dịch Công chứng / không cần tem tím khi nộp trường/ )",
      "Bảng điểm cao đẳng ( Dịch Công chứng/  không cần tem tím khi nộp trường )",
      "Bản sao hộ chiếu của học sinh/ bố mẹ",
      "Bản sao CCCD/hộ chiếu của bố mẹ",
      "Sổ hộ khẩu (giấy chứng minh quan hệ gia đình) CT07 ( Dịch công chứng)",
      "Giấy xác nhận số dư tài khoản 400tr (Giấy chứng nhận số dư phát hành trong vòng 1 tháng trước khi nộp hồ sơ).",
      "ảnh hộ chiếu nền trắng 3 st ( 3,5*4,5)",
      "Giấy khám sức khoẻ lao phổi song ngữ ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa ) \n\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
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
    "region": "chungcheongbuk",
    "intro": "- Tên tiếng Hàn: 세명대학교\n- Tên tiếng Anh: Semyung University\n- Năm thành lập: 1992\n- Loại hình: Đại học tư thục 4 năm\n- Quy mô: ~6.000 sinh viên\n- Website: www.semyung.ac.kr\n\nSemyung University là trường đại học tư thục tại thành phố Jecheon, tỉnh Bắc Chungcheong. Trường có hơn 30 chuyên ngành thuộc các lĩnh vực Luật, Kinh doanh, Y tế, Kỹ thuật và Nghệ thuật.\n\nThành phố Jecheon nổi tiếng với cảnh quan thiên nhiên đẹp (hồ Cheongpung, núi Woraksan) và thảo dược Hàn Quốc. Chi phí sinh hoạt rất thấp so với các thành phố lớn. Trường có chương trình hỗ trợ sinh viên quốc tế tốt.",
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3 (GPA 5.0)",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Quản trị kinh doanh - BUSINESS ADMINISTRATION",
      "Hàn Quốc học - KOREAN STUDIES",
      "Kỹ thuật môi trường - ENVIRONMENTAL ENGINEERING",
      "Khoa học thể thao - SPORT SCIENCE"
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp trong vòng 4 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 4",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% ngay kỳ đầu tiên\nHọc phí dự kiến: 1.500.000 - 1.700.000 KRW/kỳ (đã giảm 50%)",
    "insurance": "",
    "ktx": "KTX trong khuôn viên trường: 180.000 - 280.000 KRW/tháng\n4 người/phòng",
    "schedule": "",
    "advantages": [
      "Không yêu cầu chứng chỉ tiếng khi tham gia chương trình",
      "Không đóng băng tài chính",
      "Không Phỏng Vấn ĐSQ",
      "Chi phí sinh hoạt rất thấp (thành phố nhỏ yên tĩnh)",
      "Đại học 4 năm, bằng cấp có giá trị",
      "Môi trường an toàn, yên tĩnh phù hợp học tập",
      "Được tạm hoãn nghĩa vụ quân sự"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nHồ sơ gửi sang trường bản scan:",
      "Application form - Theo mẫu trường",
      "Giới thiệu bản thân và kế hoạch du học",
      "Thư tiến cử của Hiệu trưởng (Dịch Công chứng)",
      "Giấy xác nhận sinh viên (Dịch Công chứng)",
      "Bảng điểm cao đẳng (Dịch Công chứng)",
      "Bản sao hộ chiếu",
      "Bản sao CCCD của học sinh, bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 (Dịch Công chứng)",
      "Xác nhận số dư 13 triệu KRW đứng tên học sinh",
      "Chứng chỉ TOPIK (nếu có)",
      "03 ảnh thẻ 3,5*4,5 nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ\n\nLưu ý sổ nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa là 250-300 triệu\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
      }
    ],
    "mou": "HN, HNC, HCCT, BGIT, PMDT, DH"
  },
  "dh-nu-sinh-dongduk": {
    "id": "dh-nu-sinh-dongduk",
    "name": "DongDuk",
    "nameKr": "동덕여자대학교 | Đại học 4 năm tại Seoul - Cái nôi nghệ thuật nữ sinh - Học bổng 50% - Chỉ dành cho nữ",
    "nameEn": "Dongduk Women's University - Đại học 4 năm tại trung tâm Seoul - Học bổng 50% - ",
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
      "catalog": "https://drive.google.com/file/d/1jjenscO1WB2cBjLkAut7IxTSCLxDHUEt/view?usp=sharing"
    },
    "video": {
      "url": "https://www.dongduk.ac.kr",
      "youtubeId": "",
      "title": ""
    },
    "location": "60 Hwarang-ro 13-gil, Seongbuk-gu, Seoul 02748, Hàn Quốc (trung tâm thủ đô Seoul)",
    "region": "seoul",
    "intro": "- Tên tiếng Hàn: 동덕여자대학교\n- Tên tiếng Anh: Dongduk Women's University\n- Năm thành lập: 1908\n- Loại hình: Đại học tư thục 4 năm, dành riêng cho nữ sinh\n- Địa điểm: Seongbuk-gu, trung tâm thủ đô Seoul\n- Quy mô: khoảng 7.500–8.000 sinh viên\n- Website: www.dongduk.ac.kr\n\nDongduk Women's University là một trong những đại học nữ sinh danh tiếng nhất Hàn Quốc với hơn 116 năm lịch sử. Trường nằm trong top 24 đại học tốt nhất Seoul và top 60 đại học hàng đầu Hàn Quốc theo bảng xếp hạng EduRank.\n\nTrường được mệnh danh là \"cái nôi nghệ thuật nữ sinh Hàn Quốc\" với nhiều cựu sinh viên là nghệ sĩ nổi tiếng như Park Gyuri (KARA), Minah & Yura (Girl's Day), Jooyeon (After School), Seo Hyun-jin, Lee Sung-kyung...\n\nDongduk xếp hạng #12 tại Hàn Quốc về tác động của cựu sinh viên (EduRank), với mạng lưới alumni mạnh trong lĩnh vực văn hóa, truyền thông, thời trang và giải trí.\n\nĐược chọn tham gia dự án \"Campus Town\" của thành phố Seoul (2020) nhằm phát triển khu vực khuôn viên thành điểm sống – học tập sôi động. Là một trong những đại học được công nhận đạt chất lượng giáo dục quốc tế, giúp sinh viên dễ xin visa và học bổng quốc tế.",
    "conditions": [
      "VISA D2-6 (Du học trao đổi - Chương trình tiếng Hàn):",
      "Chỉ dành cho nữ",
      "Tốt nghiệp THPT",
      "GPA > 6.0",
      "Tốt nghiệp không quá 5 năm",
      "Có chứng chỉ TOPIK 2 hoặc Sejong 2B",
      "Có sức khỏe tốt, không mắc bệnh truyền nhiễm\n\nVISA D2-3 (Thạc sĩ nợ tiếng):",
      "Sinh năm 1987 trở về sau",
      "Không phân biệt nam nữ (chương trình thạc sĩ mở)",
      "Không yêu cầu GPA đại học cao"
    ],
    "majors": [
      "Chuyên ngành trao đổi (Korean Major - 한국어전공):\n- Giai đoạn 1 (Visa D2-6): Đào tạo Tiếng Hàn & Trải nghiệm văn hóa\n- Giai đoạn 2 (chuyển Visa D2-2): Chuyên ngành đại học 4 năm\n\nChuyên ngành Thạc sĩ (D2-3):",
      "Tư vấn giáo dục [교육컨설팅]",
      "Giáo dục Tiếng Hàn [한국어교육]\n\nCác khoa đại học (sau khi chuyển D2-2):\n- Đại học Nhân văn: Ngôn ngữ & Văn học Hàn, Lịch sử, Sáng tác, Tiếng Anh, Tiếng Nhật, Tiếng Trung...\n- Đại học Khoa học Xã hội: Thư viện, Phúc lợi xã hội\n- Đại học Kinh doanh: Kinh doanh tổng hợp\n- Đại học Khoa học Tự nhiên: Dinh dưỡng, Mỹ phẩm, Hóa học, Thể dục\n- Đại học Nghệ thuật: Hội họa, Thủ công kỹ thuật số, Âm nhạc\n- Đại học Thiết kế: Thời trang, Thiết kế thị giác, Truyền thông\n- Đại học Nghệ thuật Biểu diễn: Diễn xuất, Âm nhạc, Múa, Người mẫu\n- Đại học Thông tin: Khoa học máy tính, Thống kê"
    ],
    "conversion": [
      "D2-6 (6 tháng): Học tiếng Hàn & văn hóa → chuyển D2-2 (Đại học 4 năm)",
      "Điều kiện chuyển: Hoàn thành khóa tiếng, đủ điều kiện từ trường",
      "Học bổng chuyên ngành kỳ đầu tiên: Giảm 50%",
      "Học bổng các kỳ tiếp theo: 30%–60% tùy trình độ TOPIK",
      "D2-3 Thạc sĩ: 2,5 năm (5 học kỳ), học 1 buổi/tuần",
      "Điều kiện tốt nghiệp: TOPIK 2 (không yêu cầu viết luận văn)"
    ],
    "tuition": "VISA D2-6 (Korean Major – 6 tháng):\n- Học phí gốc: 4.195.000 KRW\n- Học bổng 50% kỳ đầu tiên: Giảm còn 2.097.500 KRW / 6 tháng\n- Miễn phí học tiếng giai đoạn D2-6\n- Học bổng các kỳ tiếp theo (D2-2): 30%–60% tùy trình độ TOPIK\n\nVISA D2-3 Thạc sĩ (5 kỳ học, 2,5 năm):\n- Học phí: 2.372.500 KRW/kỳ (đã giảm 50% cho toàn bộ 5 kỳ)\n- Miễn phí nhập học: 0 KRW (miễn 921.000 KRW)\n- Học bổng thêm 500.000 KRW khi đạt TOPIK 4",
    "insurance": "",
    "ktx": "Trường có ký túc xá trong khuôn viên campus:\n- Phòng đơn và phòng đôi (có bàn học, giường, tủ)\n- Hỗ trợ bảo hiểm và hỗ trợ việc làm cho sinh viên quốc tế\n- Chi phí KTX: Liên hệ trường để biết chi tiết từng kỳ\n- Chi phí sinh hoạt ước tính tại Seoul: 500.000–800.000 KRW/tháng\n- Địa chỉ trường: 60 Hwarang-ro 13-gil, Seongbuk-gu, Seoul 02748",
    "schedule": "",
    "advantages": [
      "Đại học 4 năm uy tín tọa lạc tại trung tâm thủ đô Seoul – bằng cấp được công nhận quốc tế",
      "Học bổng 50% ngay kỳ đầu tiên (chuyên ngành), miễn phí học tiếng giai đoạn D2-6",
      "Học bổng 30%–60% các kỳ tiếp theo tùy trình độ TOPIK",
      "Không yêu cầu tiếng Hàn cao (chỉ cần TOPIK 2 / Sejong 2B)",
      "Không Phỏng Vấn ĐSQ (với chương trình D2-6)",
      "Được làm thêm hợp pháp, thu nhập dao động 40–50 triệu VNĐ/tháng",
      "Môi trường học tập toàn nữ – an toàn, thân thiện cho nữ sinh",
      "Cơ hội tiếp xúc ngành Nghệ thuật, Thời trang, Biểu diễn đặc trưng của trường",
      "Có thể chuyển Visa E-7 sau tốt nghiệp để làm việc lâu dài tại Hàn Quốc",
      "Có thể chuyển Visa D-2 để học lên cao đẳng hoặc đại học các ngành khác",
      "Được tạm hoãn nghĩa vụ quân sự (với sinh viên nam nếu có)"
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản Word + PDF, làm bằng tiếng Hàn/tiếng Anh\n\nHồ sơ gửi sang trường (bản scan):",
      "Application form (Thư đăng ký nhập học) – Theo mẫu của trường",
      "Giới thiệu bản thân và kế hoạch du học – Theo mẫu",
      "Giấy xác nhận sinh viên (Dịch Công chứng + Tem tím)",
      "Bảng điểm đại học/cao đẳng (Dịch Công chứng + Tem tím)",
      "Bằng tốt nghiệp + Học bạ (Dịch Công chứng)",
      "Thư tiến cử của Hiệu trưởng trường Việt Nam (Dịch Công chứng)",
      "Bản sao hộ chiếu học sinh + bố mẹ (Dịch Công chứng)",
      "Bản sao CCCD học sinh + bố mẹ (Dịch Công chứng)",
      "Giấy khai sinh (Dịch Công chứng)",
      "CT07 / Sổ hộ khẩu – Giấy chứng minh quan hệ gia đình (Dịch Công chứng)",
      "Xác nhận số dư tài khoản tiết kiệm đứng tên học sinh – tối thiểu 13 triệu KRW\n    (Phát hành trong vòng 1 tháng trước khi nộp hồ sơ)",
      "Giấy xác nhận thu nhập/nơi công tác của bố mẹ (Dịch Công chứng)",
      "03 ảnh thẻ 3,5x4,5 cm nền trắng",
      "Giấy khám sức khoẻ lao phổi song ngữ (2 bản: 1 nộp trường + 1 nộp ĐSQ)",
      "Chứng chỉ TOPIK/Sejong (nếu có)\n\nLưu ý nộp ĐSQ/LSQ:\n- Số tiền CMTC khi nộp hồ sơ xin Visa: 250–300 triệu VNĐ\n- Tem tím: 4 loại x 2 bản = 8 tem (1 bản nộp ĐSQ + 1 bản mang sang trường)\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á VÀ NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
    "documentsNote": "Invoice mẫu DWU-000001 (đính kèm trong catalog PDF)",
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
      }
    ],
    "mou": "HN, HNC, HCCT, BGIT, PMDT, DH"
  },
  "dh-catholic-kwandong": {
    "id": "dh-catholic-kwandong",
    "name": "Catholic Kwandong",
    "nameKr": "가톨릭관동대학교 | Trường đại học 4 năm tại Gangneung - Nhiều ngành học - Học bổng lên đến 80%",
    "nameEn": "Catholic Kwandong University | 가톨릭관동대학교 - Trường ĐH tư thục 70 năm truyền thống ",
    "system": "D2-2 (Đại học 4 năm)",
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
      "catalog": "https://drive.google.com/file/d/1-udyYf1vbgkUrX1QMPNpsfJnUyxoUXfA/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=3fEWfRndKeg",
      "youtubeId": "3fEWfRndKeg",
      "title": ""
    },
    "location": "24, Beomil-ro 579 beon-gil, Gangneung-si, Gangwon-do 25601, Hàn Quốc (cách Seoul ~3 giờ, gần biển Gangneung)",
    "region": "gangwon",
    "intro": "- Tên tiếng Hàn: 가톨릭관동대학교\n- Tên tiếng Anh: Catholic Kwandong University (CKU)\n- Năm thành lập: 1955 (70 năm truyền thống)\n- Loại trường: Đại học tư thục (Công giáo)\n- Vị trí: Thành phố Gangneung, tỉnh Gangwon-do - thành phố biển nổi tiếng với bãi biển Gyeongpo, trường quay của nhiều bộ phim và MV K-pop (BTS, Goblin, Mr. Sunshine...).\n- Hệ thống đào tạo: Trinity Convergence University - đào tạo đa ngành, tích hợp AI và công nghệ.\n- Trường là cơ sở thi TOPIK chính thức, tổ chức 6 lần/năm - tiện lợi cho sinh viên luyện thi.\n- Có trung tâm hỗ trợ du học sinh toàn diện (유학생원스톱서비스센터): từ học tập, visa, KTX đến việc làm và định cư sau tốt nghiệp.\n- Website: www.cku.ac.kr",
    "conditions": [
      "Tiêu chí xét tuyển (Track Hàn Quốc):",
      "Bố và mẹ đều là người nước ngoài (không có quốc tịch Hàn Quốc)",
      "Đã tốt nghiệp THPT (tương đương)",
      "Đáp ứng một trong các tiêu chí tiếng Hàn sau:\n   - TOPIK 3 trở lên (track chính), hoặc TOPIK 2 với một số ngành thể dục/nghệ thuật\n   - Sejonghakdang Trung cấp 1 trở lên\n   - Chương trình hội nhập xã hội Bộ Tư pháp cấp 3 hoặc điểm sơ khảo ≥ 61\n   - Đạt CKU-TOPIK nội bộ hoặc hoàn thành khóa tiếng Hàn cấp 3 tại trường ngôn ngữ trong nước",
      "Track Tiếng Anh: TOEFL iBT 71 / IELTS 5.5 / CEFR B2 / TEPS 601 trở lên",
      "Không phân biệt vùng miền tại Việt Nam",
      "Có sức khỏe tốt (cần nộp giấy khám bao gồm viêm gan, lao phổi)"
    ],
    "majors": [
      "Các ngành tuyển sinh (Track Hàn Quốc - D2-2 Đại học 4 năm):\n■ Tự chọn ngành (자율전공학부) - Chọn ngành sau năm 1\n■ Kinh doanh - Quản trị (경영학전공)\n■ Hành chính học (행정학전공)\n■ Công tác xã hội (사회복지학전공)\n■ Quảng cáo & PR (광고홍보학전공)\n■ Quản trị khách sạn & du lịch (호텔관광경영학전공)\n■ Ẩm thực & kinh doanh nhà hàng (조리외식경영학전공)\n■ Quản trị y tế (의료경영학전공)\n■ Logistics hàng không (항공교통물류전공)\n■ Truyền thông đa phương tiện (미디어콘텐츠전공)\n■ Khoa học Y sinh (의생명과학전공)\n■ Kỹ thuật xây dựng / Kiến trúc 5 năm (건축공학전공 / 건축학전공)\n■ AI & Phần mềm (AI·소프트웨어융합학부)\n■ Điều khiển máy bay (항공운항전공)\n■ Kỹ thuật bảo trì hàng không (항공정비학전공)\n■ Cảng thông minh (스마트항만공학전공)\n■ Thể thao - Giải trí - Huấn luyện (스포츠레저/재활의학/지도학전공)\n■ Âm nhạc thực dụng (실용음악전공)\n■ CG Design (CG디자인전공)"
    ],
    "conversion": [
      "D2-6 (6 tháng): Học tiếng Hàn & văn hóa → chuyển D2-2 (Đại học 4 năm)",
      "Điều kiện chuyển: Hoàn thành khóa tiếng, đủ điều kiện từ trường",
      "Học bổng chuyên ngành kỳ đầu tiên: Giảm 50%",
      "Học bổng các kỳ tiếp theo: 30%–60% tùy trình độ TOPIK"
    ],
    "tuition": "Học phí (năm học 2025, dự kiến 2026 có thể thay đổi):\n- Ngành Tự chọn/Quảng học (광역): 3.772.000 KRW/học kỳ\n- Ngành Nhân văn - Xã hội: 3.397.000 KRW/học kỳ\n- Ngành Khoa học tự nhiên: 3.951.000 KRW/học kỳ\n- Ngành Kỹ thuật / Hàng không: 4.438.000 KRW/học kỳ\n- Ngành Nghệ thuật - Thể thao: 4.482.000 KRW/học kỳ\n\nSau học bổng tân sinh viên 80%, ví dụ:\n- Nhân văn-Xã hội: còn ~679.400 KRW/học kỳ (~12 triệu VND)\n- Kỹ thuật: còn ~887.600 KRW/học kỳ (~16 triệu VND)\n\nLệ phí thi tuyển: 70.000 KRW (không hoàn lại)",
    "insurance": "",
    "ktx": "- KTX (Ký túc xá) nội trú: 1.200.000 KRW/6 tháng (phòng đôi, chưa bao gồm ăn)\n- Chi phí sinh hoạt ước tính: 400.000 - 600.000 KRW/tháng (thấp hơn Seoul đáng kể)\n- Gangneung có nhiều cơ hội việc làm thêm (du lịch, dịch vụ, khu resort biển)",
    "schedule": "",
    "advantages": [
      "Học bổng lên đến 80% ngay khi nhập học (tân sinh viên ngoại quốc đặc biệt).",
      "Trong quá trình học có thể đạt học bổng 100% nếu đạt TOPIK 5 trở lên.",
      "Trường tổ chức TOPIK 6 lần/năm - tiện lợi, không phải di chuyển xa.",
      "Hệ thống đào tạo linh hoạt: có thể học đa ngành, nhận 2 bằng, hoặc tự thiết kế chương trình học.",
      "Học tiếng Hàn và văn hóa Hàn tập trung trong 2 năm đầu - hỗ trợ thích nghi nhanh.",
      "Trung tâm hỗ trợ du học sinh toàn diện (visa, KTX, việc làm thêm, tư vấn pháp lý, tâm lý).",
      "Thành phố Gangneung chi phí sinh hoạt thấp hơn Seoul, dễ tìm nhà, nhiều cơ hội việc làm thêm.",
      "Sau tốt nghiệp có thể học liên thông lên cao học tại CKU với học bổng đặc biệt.",
      "Môi trường sống sôi động: gần biển, nhiều địa điểm du lịch nổi tiếng, nhiều phim Hàn quay tại đây."
    ],
    "documents": [
      "Hồ sơ nộp lần đầu (bản gốc + bản scan):",
      "Phiếu chuyển tiền học phí thi tuyển 70.000 KRW",
      "Đơn đăng ký nhập học (theo mẫu trường - tải tại https://ipsi.cku.ac.kr)",
      "Bản sao hộ chiếu của thí sinh",
      "Bản sao hộ chiếu hoặc CCCD của bố/mẹ",
      "Giấy khai sinh hoặc giấy chứng nhận quan hệ gia đình (dịch công chứng)",
      "Bằng tốt nghiệp THPT (bản gốc, có Apostille hoặc xác nhận lãnh sự)",
      "Bảng điểm THPT (bản gốc, có Apostille)",
      "Chứng chỉ tiếng Hàn (TOPIK/Sejonghakdang/Chương trình hội nhập...) - trong vòng 2 năm\n   * Track Tiếng Anh: TOEFL/IELTS/CEFR/TEPS",
      "Giấy khám sức khỏe (bao gồm viêm gan, lao phổi) - song ngữ\n\nHồ sơ bổ sung sau khi đậu (để xin Visa D2-2):",
      "Xác nhận số dư ngân hàng tiếng Anh (tối thiểu 16 triệu KRW/năm - đứng tên học sinh, gửi trên 6 tháng)\n   * Nếu học tại CKU Korean Language Institute trước: chỉ cần 8 triệu KRW/năm",
      "Giấy xác nhận việc làm và thu nhập của bố mẹ",
      "Giấy khám sức khỏe (viêm gan + lao phổi)",
      "Đơn xin cấp visa (mẫu theo Luật Xuất nhập cảnh)\n\nLưu ý: Tất cả giấy tờ nước ngoài phải có Apostille hoặc xác nhận lãnh sự Hàn Quốc\nĐịa chỉ nộp: Phòng Quan hệ Quốc tế - John Bosco Hall 101, CKU\nEmail: irc@cku.ac.kr | Tel: +82-33-649-7085 / 7970"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
      }
    ],
    "mou": "HN, HNC, HCCT, BGIT, PMDT, DH"
  },
  "dh-jeonju": {
    "id": "dh-jeonju",
    "name": "Jeonju",
    "nameKr": "전주대학교 | Đại học nuôi dưỡng siêu sao - Chi phí hợp lý - Tỷ lệ Visa tốt",
    "nameEn": "Jeonju University",
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
      "catalog": "https://drive.google.com/file/d/1SRni65v84X5v6ujbKBsdLHbj2JHAZGpo/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1vFPfCVRaBn8rZvKwl4-ZYvodimvmQ8DM/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=el1j8k0C_ek",
      "youtubeId": "el1j8k0C_ek",
      "title": ""
    },
    "location": [
      {
        "t": "Tọa lạc tại khu đô thị mới Jeonju. Cách bến xe phía Nam Seoul ~3 tiếng (12 chuyến/ngày). Gần làng cổ Hanok nổi tiếng.",
        "c": "#000000"
      }
    ],
    "region": "jeollabuk",
    "intro": [
      {
        "t": "- Tên tiếng Hàn: 전주대학교\n- Tên tiếng Anh: Jeonju University\n- Loại hình: Đại học tư thục 4 năm\n- Quy mô: ~10,422 sinh viên đang học, 91,860 cựu sinh viên, 334 giáo sư chính, 73 khoa\n- Website: www.jeonju.ac.kr\n\nJeonju University là trường đại học tọa lạc tại thành phố Jeonju - trung tâm văn hóa đặc trưng nhất của Hàn Quốc, được chỉ định là thành phố du lịch văn hóa trọng điểm. Khuôn viên trường nổi tiếng là địa điểm quay phim nhiều bộ phim/drama Hàn Quốc (Our Beloved Summer, Love Alarm 2, The Bequeathed, In Our Prime).\n\nTrường có quan hệ hợp tác quốc tế với 264 trường tại 31 quốc gia và 23 cơ quan tại 11 quốc gia.",
        "c": "#000000"
      }
    ],
    "conditions": [
      "Dưới 25 tuổi",
      "Có học bạ cấp 3",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá quy định",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt, không mắc bệnh truyền nhiễm"
    ],
    "majors": [
      "Đại học Kinh doanh: Quản trị kinh doanh, Thương mại & Logistic, Tài chính & Bảo hiểm, Kế toán & Thuế, Tài chính IT, Thông tin Đất đai & BĐS\nĐại học Hội tụ Phần mềm: Trí tuệ Nhân tạo, Máy tính, Phương tiện thông minh, Kỹ thuật Dữ liệu\nĐại học Văn hóa Du lịch: Quản trị Du lịch, Quản trị Khách sạn, Ẩm thực Hàn Quốc, Công nghiệp Thời trang, Quản lý & Dịch vụ ẩm thực\nĐại học Hội tụ Văn hóa: Thiết kế đồ họa, Thiết kế Công nghiệp, Điện ảnh & Truyền hình, Nghệ thuật biểu diễn, Taekwondo, Bóng đá, Thể dục...\nĐại học Kỹ thuật: Kiến trúc, Kỹ thuật Cơ khí, Kỹ thuật Điện & Điện tử, Phòng cháy Chữa cháy...\nĐại học Nội dung Nhân văn, Khoa học Xã hội, Y học..."
    ],
    "conversion": [
      "Học D2-6 trong vòng 1 năm (tiếng Hàn)",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2-2 và học tiếp 3-4 năm",
      "Điều kiện để tốt nghiệp: Có chứng chỉ TOPIK 4 trở lên",
      "Cũng có chương trình chuyển tiếp 1+3, 2+2, 3+1 từ trường Việt Nam"
    ],
    "tuition": [
      {
        "t": "Học phí theo ngành (mỗi học kỳ, dựa trên năm 2026):\n- Đại học Nhân văn / Khoa học Xã hội / Kinh doanh: 3,665,000 KRW (~2,440 USD)\n- Đại học Hội tụ Văn hóa (Trị liệu, Thể thao, Taekwondo, Bóng đá) / Y học / Văn hóa Du lịch: 4,302,000 KRW (~2,870 USD)\n- Đại học Hội tụ Phần mềm / Kỹ thuật / Hội tụ Văn hóa (Game, Thiết kế, Nghệ thuật...): 4,788,000 KRW (~3,200 USD)\n\nHọc bổng khi nhập học (dựa trên TOPIK):\n- Cấp 3: Giảm 20% | Cấp 4: Giảm 50% | Cấp 5: Giảm 80% | Cấp 6: Giảm 100%\n- Học bổng đặc biệt: Giảm 20%-100% tùy trường hợp",
        "c": "#000000"
      }
    ],
    "insurance": "",
    "ktx": [
      {
        "t": "StarTower (kiểu khách sạn, 18 tầng, ~1,000 chỗ):\n- Phòng đơn: 1,890,000 KRW/kỳ (~1,360 USD)\n- Phòng đôi: 1,252,000 KRW/kỳ (~900 USD)\n- Phòng 4 người: 954,000 KRW/kỳ (~690 USD)\n\nStarvill: Phòng đơn ~730 USD/kỳ | Phòng đôi ~580 USD/kỳ\nStarhome: Phòng đơn ~860 USD/kỳ | Phòng đôi ~625 USD/kỳ\n(Chi phí trên chưa bao gồm ăn uống, dựa trên năm 2024)\n\nThu nhập làm thêm: 10,320 KRW/giờ (2026), 20h/tuần ~ 825,600 KRW/tháng (~350 USD)\nPhí sinh hoạt dự kiến (ăn uống): ~500,000 KRW/tháng (~330 USD)",
        "c": "#000000"
      }
    ],
    "schedule": "",
    "advantages": [
      "Trường tọa lạc tại thành phố văn hóa nổi tiếng nhất Hàn Quốc (Jeonju)",
      "Khuôn viên đẹp, nổi tiếng là địa điểm quay phim nhiều bộ phim/drama Hàn Quốc",
      "Ký túc xá Star Tower kiểu khách sạn 18 tầng (~1,000 chỗ), ưu tiên cho sinh viên quốc tế",
      "Học bổng đa dạng dựa trên thành tích TOPIK (50%-100%)",
      "Hỗ trợ trợ giảng theo quốc gia (có tiếng Việt)",
      "Đứng đầu khu vực về tỷ lệ ra visa làm việc F2-R",
      "Chi phí học tập thấp hơn so với trường thủ đô (~10,000$/năm vs >15,000$/năm)",
      "Chương trình Hostfamily - kết nối sinh viên với gia đình Hàn Quốc địa phương"
    ],
    "documents": [
      "Hồ sơ sinh viên trao đổi (Visa D-2-6):",
      "Đơn xin nhập học (mẫu trường)",
      "Thư giới thiệu (bản gốc tiếng Anh, có dấu xác nhận trường)",
      "Bằng tốt nghiệp THPT (dịch thuật, công chứng, hợp pháp hóa)",
      "Học bạ (dịch thuật, công chứng, hợp pháp hóa)",
      "Giấy xác nhận sinh viên (bản gốc tiếng Anh, hợp pháp hóa)",
      "Bảng điểm (bản gốc tiếng Anh, hợp pháp hóa)",
      "Hộ chiếu (photo, còn hạn)",
      "CCCD của bố, mẹ và sinh viên (dịch thuật, công chứng)",
      "Giấy khai sinh (dịch thuật, công chứng)",
      "Hộ khẩu (dịch thuật, công chứng)",
      "Chứng minh tài chính: 8,000,000 KRW (6 tháng) / 16,000,000 KRW (1 năm)",
      "Giấy xác nhận nghề nghiệp và thu nhập bố mẹ (dịch thuật, công chứng)",
      "Chứng chỉ ngoại ngữ: TOPIK cấp 2 trở lên HOẶC IELTS 5.5/iBT 71 trở lên",
      "Phiếu xác nhận sức khỏe (khám lao)",
      "Ảnh thẻ 3.5x4.5 nền trắng"
    ],
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
        "nameKr": "Cao đẳng Truyền hình Việt Nam"
      },
      {
        "code": "BGIT",
        "name": "Cao đẳng Công nghiệp Bắc Giang",
        "nameKr": "Cao đẳng Công nghiệp Bắc Giang"
      },
      {
        "code": "HPC-HP",
        "name": "Cao đẳng Y tế Hải Phòng",
        "nameKr": "Cao đẳng Y tế Hải Phòng"
      },
      {
        "code": "PMDT",
        "name": "Cao đẳng Công nghệ Y Dược Việt Nam",
        "nameKr": "Cao đẳng Công nghệ Y Dược Việt Nam"
      },
      {
        "code": "TWU",
        "name": "Đại học Trưng Vương",
        "nameKr": "Đại học Trưng Vương"
      },
      {
        "code": "UTM",
        "name": "ĐH Quản lý và Kinh doanh Hữu Nghị",
        "nameKr": "ĐH Quản lý và Kinh doanh Hữu Nghị"
      },
      {
        "code": "KTTT",
        "name": "Cao đẳng Kinh tế Kỹ thuật Thương mại",
        "nameKr": "Cao đẳng Kinh tế Kỹ thuật Thương mại"
      },
      {
        "code": "SGT",
        "name": "Cao đẳng Công nghệ Sài Gòn",
        "nameKr": "Cao đẳng Công nghệ Sài Gòn"
      },
      {
        "code": "ISPACE",
        "name": "Cao đẳng Công nghệ i-Space",
        "nameKr": "Cao đẳng Công nghệ i-Space"
      },
      {
        "code": "DA",
        "name": "Cao đẳng Đồng An",
        "nameKr": "Cao đẳng Đồng An"
      },
      {
        "code": "SDU",
        "name": "Đại học Sao Đỏ",
        "nameKr": "Đại học Sao Đỏ"
      },
      {
        "code": "DH",
        "name": "Cao đẳng Duyên hải",
        "nameKr": "Cao đẳng Duyên hải"
      }
    ],
    "mou": "HN, HCCT, VTV, BGIT, UTM, KTTT, SGT"
  }
};

const EXTRA_SHEETS = {
  "visaChecklist": {
    "name": "Check list HS xin Visa D2-6",
    "items": [
      {
        "stt": "1",
        "noidung": "Application Form Đại Sứ Quán",
        "luuy": "Theo mẫu của ĐSQ",
        "link": "",
        "linkText": "ĐƠN XIN CẤP VISA - MẪU.pdf"
      },
      {
        "stt": "2",
        "noidung": "Đơn xác nhận lịch sử bị từ chối visa",
        "luuy": "Theo mẫu của ĐSQ",
        "link": "",
        "linkText": "đơn xác nhận từ chối visa.pdf"
      },
      {
        "stt": "3",
        "noidung": "Thư mời nhập học của trường Hàn",
        "luuy": "Bản photo",
        "link": "",
        "linkText": "Thư mời nhập học mẫu.pdf"
      },
      {
        "stt": "4",
        "noidung": "Đăng ký kinh doanh trường Hàn",
        "luuy": "Bản photo",
        "link": "",
        "linkText": "ĐKKKD các trường.rar"
      },
      {
        "stt": "5",
        "noidung": "MOU trường",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "6",
        "noidung": "Quyết định trao đổi sinh viên",
        "luuy": "Dịch thuật + công thức",
        "link": "",
        "linkText": "THƯ TIẾN CỬ HN - YEONSUNG.pdf\nTHƯ TIẾN CỬ HỮU NGHỊ-1.pdf"
      },
      {
        "stt": "7",
        "noidung": "Giấy khám sức khỏe",
        "luuy": "Sẽ phải khám sức khỏe:\n1: Khi nộp hồ sơ xin Visa ĐSQ/LSQ lao Phổi\n2: Trước khi xuất cảnh 1 tuần khám lao phổi + Bổ sung viêm gan B",
        "link": "",
        "linkText": "Full khám sức khỏe.pdf"
      },
      {
        "stt": "8",
        "noidung": "Kế hoạch học tập + Giới thiệu bản thân nộp ĐSQ",
        "luuy": "Cần viết theo chuẩn mẫu Fastgo hướng dẫn - Bản viết tay",
        "link": "",
        "linkText": "GTBT+ KHHT Phạm Đình Tùng Dương.docx"
      },
      {
        "stt": "9",
        "noidung": "Tem tím bằng TN",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "10",
        "noidung": "Tem tím học bạ THPT",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "11",
        "noidung": "Tem tím bảng điểm ĐH/ CĐ",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "12",
        "noidung": "Tem tím Xác nhận sinh viên",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "13",
        "noidung": "Sổ tiết kiệm của học sinh",
        "luuy": "- Đứng tên học sinh \n- Đáo hạn sổ: 1 năm\n- Số tiền tối thiểu: 300 triệu\n- Không yêu cầu sổ lùi\n- Xác nhận số dư đi kèm",
        "link": "",
        "linkText": "- Sổ đứng tên HỌC SINH\n- Trừ các ngân hàng: BẮC Á, CHÍNH SÁCH XÃ HỘI"
      },
      {
        "stt": "14",
        "noidung": "Xác nhận thu nhập, bảng lương và bảo hiểm xã hội",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": "XAC NHAN CONG VIEC.pdf"
      },
      {
        "stt": "15",
        "noidung": "Hợp đồng nghề nghiệp / Giấy xác nhận công việc",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "16",
        "noidung": "Sao kê TK bố",
        "luuy": "Trước 10 ngày nộp xin Visa - Sao kê trong vòng 6 tháng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "17",
        "noidung": "Sao kê TK mẹ",
        "luuy": "Trước 10 ngày nộp xin Visa - Sao kê trong vòng 6 tháng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "18",
        "noidung": "Sổ đỏ",
        "luuy": "Càng nhiều càng tốt",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "19",
        "noidung": "Giải trình ĐKKD nếu có",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "20",
        "noidung": "Giải trình sao kê",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "21",
        "noidung": "Giải trình địa chỉ",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "22",
        "noidung": "Cam kết bảo lãnh tài chính",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "23",
        "noidung": "Giấy khai sinh",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "24",
        "noidung": "CTO7",
        "luuy": "Phải chuẩn form của ĐSQ yêu cầu",
        "link": "",
        "linkText": "quy chuẩn CT07.pdf"
      },
      {
        "stt": "25",
        "noidung": "Photo hộ chiếu",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "26",
        "noidung": "CCCD Học sinh",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "27",
        "noidung": "CCCD Bố",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "28",
        "noidung": "CCCD Mẹ",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "29",
        "noidung": "Giấy Xác nhận sinh viên ( bản gốc )",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "30",
        "noidung": "Bảng điểm Cao đẳng / Đại học * bản gốc )",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "31",
        "noidung": "Học bạ gốc",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "32",
        "noidung": "Bằng tốt nghiệp gốc",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "33",
        "noidung": "Bảo hiểm nhân thọ của bố/mẹ",
        "luuy": "Nên bổ sung nếu có > ĐSQ/LSQ coi đây như 1 tài sản có giá trị",
        "link": "",
        "linkText": "bảo hiểm tham khảo.pdf"
      },
      {
        "stt": "33",
        "noidung": "Mẫu biên lai khi nộp xin Visa thành công",
        "luuy": "",
        "link": "",
        "linkText": "bien lai visa.pdf"
      },
      {
        "stt": "34",
        "noidung": "Full bộ hồ sơ chuẩn D2-6 nộp ĐSQ tham khảo",
        "luuy": "",
        "link": "",
        "linkText": "3. NGUYỄN HỮU TRUNG D2-6 T9-2025.pdf"
      },
      {
        "stt": "35",
        "noidung": "Quy trình chứng minh tài chính Visa D2-6",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "",
        "linkText": "Quy trình chứng minh tài chính.pdf"
      },
      {
        "stt": "36",
        "noidung": "Quy trình làm hồ sơ sau khi nhập cảnh",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "",
        "linkText": "Quy trình làm hồ sơ sau khi nhập cảnh tại Hàn Quốc.pdf"
      },
      {
        "stt": "37",
        "noidung": "Địa chỉ khám sức khỏe theo ĐSQ quy định",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "",
        "linkText": "Địa chỉ khám sức khỏe.jpg"
      }
    ]
  },
  "phongVan": {
    "name": "Tài liệu ôn phỏng vấn trường Hàn",
    "items": []
  },
  "application": {
    "name": "Application trường Hàn",
    "schools": []
  },
  "tem": {
    "name": "Thông tin làm tem các trường",
    "schools": []
  },
  "danhSach": {
    "name": "Danh sách trường Hàn",
    "rows": [
      {
        "name": "Osan",
        "nameKr": "오산대학교 | Dễ chuyển đổi E7, học ít - Yêu cầu khó, việc làm nhiều - PV siêu khó",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HCCT, VTV, SGT, KTTU",
        "catalog": "documents/Giới-thiệu-trường-Osan.pdf"
      },
      {
        "name": "Induk",
        "nameKr": "인덕대학교 | Học ít - Việc làm nhiều - Cạnh tranh cao, lương cao - Tỷ lệ Visa không quá tốt",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, VTV, BGIT, TWU, SDU, DH",
        "catalog": "documents/Induk-University-Catalog-(1).pdf"
      },
      {
        "name": "YeonSung",
        "nameKr": "연성대학교 | Việc làm nhiều - Tỷ lệ đỗ cực cao - Gần Seoul",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HCCT, BGIT, KTTT, SGT, DA, SDU, KTTU",
        "catalog": "documents/Yeonsung-University-Catalog.pdf"
      },
      {
        "name": "Sangmyung",
        "nameKr": "상명대학교 | Trường 4 năm uy tín tại Seoul - Tỷ lệ chuyển E7 tốt - Học nặng hơn",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, VTV, BGIT, HPC-HP, KTTT, DH",
        "catalog": "https://drive.google.com/file/d/1U79U2e7tqad3s4rHVBWOh1v7-bqe4Y76/view?usp=sharing"
      },
      {
        "name": "KyungGin",
        "nameKr": "경인여자대학교 | Tỷ lệ Visa rất tốt - Chuyển đổi E7 tốt - Gần sân bay Incheon - Chỉ dành cho nữ",
        "system": "D2-6 > D2-1 (Cao Đẳng )",
        "quota": 200,
        "mou": "HNC, VTV, BGIT, UTM, SGT, KTTU",
        "catalog": "https://drive.google.com/file/d/1koKmGXVjZmSBtiSRcqaMuf3blbO_w4W0/view?usp=sharing"
      },
      {
        "name": "Dongnam",
        "nameKr": "동남보건대학교 | Tỷ lệ Đỗ tuyệt đối - Học khá nhiều - Việc làm thêm khá hạn chế",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HPC, HCCT, SGT, BCIT",
        "catalog": "documents/Dongnam-University-Catalog-.pdf"
      },
      {
        "name": "Dong-Eui",
        "nameKr": "동의대학교 | Tỷ lệ đỗ cực cao - Việc làm thêm nhiều - Tỷ lệ chuyển đổi E7 tốt - Học khá nặng",
        "system": "D2-6 > D2-2 (Đại học)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, VTV, HPC-HP, PMDT, UTM, SGT, SDU",
        "catalog": "https://drive.google.com/file/d/1OvD9XCX6dLBaIR6IKTdgtnfoT-Op3gU-/view?usp=sharing"
      },
      {
        "name": "Suncheon Jeil",
        "nameKr": "순천제일 | Dễ chuyển đổi E7 - Tỷ lệ Visa tốt - Việc làm thêm đa dạng - Trường không hot",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, VTV, HPC-HP, SGT, DH",
        "catalog": "https://drive.google.com/file/d/1xVMO320agblD8atS_Mvj8jFenFePBDOz/view?usp=sharing"
      },
      {
        "name": "Nữ Busan",
        "nameKr": "부산여자대학교 | Trường nữ sinh Busan - Chi phí hợp lý - Gần trung tâm thành phố",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HN, HCCT, VTV, UTM, SGT, DH",
        "catalog": "documents/Nữ-sinh-Busan-catalog.pdf"
      },
      {
        "name": "Busan Catholic",
        "nameKr": "부산가톨릭대학교 | Trường Công giáo uy tín tại Busan - Ngành Y tế nổi bật - Tỷ lệ Visa ổn định",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HCCT, BGIT, HPC-HP, PMDT, UTM, KTTT, DA",
        "catalog": "https://drive.google.com/file/d/1c4XfGO424-5OINQI9YuaCNPYY4WXNeaC/view?usp=sharing"
      },
      {
        "name": "Gimhae",
        "nameKr": "김해대학교 | Gần sân bay Gimhae - Chi phí sinh hoạt thấp - Nhiều chuyên ngành kỹ thuật",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HCCT, VTV, BGIT, HPC-HP, PMDT, UTM, ISPACE, DA, SDU",
        "catalog": "https://drive.google.com/file/d/1Yy3ceBqYGYelV-tmfAl-9ZVprNvctmhN/view?usp=sharing"
      },
      {
        "name": "Gwangju",
        "nameKr": "광주대학교 | Đại học uy tín Gwangju - Chi phí thấp - Khu vực miền Nam nhiều việc làm",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HCCT, VTV, BGIT, UTM, KTTT, SGT",
        "catalog": "documents/Gwangju-University-Catalog.pdf"
      },
      {
        "name": "Nambu",
        "nameKr": "남부대학교 | Đại học miền Nam Gwangju - Chi phí thấp nhất - Tỷ lệ Visa tốt",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HNC, HCCT, VTV, BGIT, HPC-HP, PMDT, UTM, SGT, SDU, KTTU",
        "catalog": "documents/Nambu-University-Catalog.pdf"
      },
      {
        "name": "Daewon",
        "nameKr": "대원대학교 | Chi phí thấp - Hỗ trợ E7 liên kết Samsung & Hyundai - Có thể học Online",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HCCT, BGIT, PMDT, UTM, DH, KTTU",
        "catalog": "https://drive.google.com/file/d/1UY4eFsyTNxAiOxseN5Ofxu5hfPNGE_P5/view?usp=sharing"
      },
      {
        "name": "Sengmyung",
        "nameKr": "세명대학교 | Trường địa phương ổn định - Chi phí thấp - Dễ chuyển đổi chuyên ngành",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, BGIT, PMDT, DH",
        "catalog": "documents/Semyung-University-Catalog.pdf"
      },
      {
        "name": "DongDuk",
        "nameKr": "동덕여자대학교 | Đại học 4 năm tại Seoul - Cái nôi nghệ thuật nữ sinh - Học bổng 50% - Chỉ dành cho nữ",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, BGIT, PMDT, DH",
        "catalog": "https://drive.google.com/file/d/1jjenscO1WB2cBjLkAut7IxTSCLxDHUEt/view?usp=sharing"
      },
      {
        "name": "Catholic Kwandong",
        "nameKr": "가톨릭관동대학교 | Trường đại học 4 năm tại Gangneung - Nhiều ngành học - Học bổng lên đến 80%",
        "system": "D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HNC, HCCT, BGIT, PMDT, DH",
        "catalog": "https://drive.google.com/file/d/1-udyYf1vbgkUrX1QMPNpsfJnUyxoUXfA/view?usp=sharing"
      },
      {
        "name": "Jeonju",
        "nameKr": "전주대학교 | Đại học nuôi dưỡng siêu sao - Chi phí hợp lý - Tỷ lệ Visa tốt",
        "system": "D2-6 > D2-2 (Đại học 4 năm)",
        "quota": 200,
        "mou": "HN, HCCT, VTV, BGIT, UTM, KTTT, SGT",
        "catalog": "https://drive.google.com/file/d/1SRni65v84X5v6ujbKBsdLHbj2JHAZGpo/view?usp=sharing"
      }
    ]
  }
};
