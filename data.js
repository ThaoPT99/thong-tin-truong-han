// Dữ liệu các trường Hàn - Tự động sinh từ Excel
// File nguồn: Thông tin trường Hàn kỳ tháng 9_2026.xlsx
// Chạy: python excel_to_data.py

const SCHOOLS_DATA = {
  "dong-eui": {
    "id": "dong-eui",
    "name": "Dong-Eui",
    "nameKr": "동의대학교",
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
      "catalog": "https://drive.google.com/file/d/1MQbj-xk9pruCY02PzuJrf_WbIG_5g9rw/view?usp=drive_link"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=LPOpQScPLXY",
      "youtubeId": "LPOpQScPLXY",
      "title": ""
    },
    "location": "176 Eomgwang-ro, Gaya 3(sam)-dong, Busanjin-gu, Busan, Hàn Quốc",
    "intro": [
      {
        "t": "Tên tiếng Hàn: 동의대학교\nTên tiếng Anh: Dong-Eui University",
        "c": null
      },
      {
        "t": "\nNăm thành lập: 1977\nLoại hình: Đại học tư thục hệ 4 năm\nĐịa điểm: Thành phố Busan, Hàn Quốc\nCơ sở:\nGaya Campus: 176 Eomgwangno, Busanjin-gu, Busan\nYangjeong Campus: 100 Jinri 1-ro, Busanjin-gu, Busan\nWebsite: ",
        "c": null
      },
      {
        "t": "deu.ac.kr",
        "c": "#1155CC"
      },
      {
        "t": "\nTrường nằm tại trung tâm \nthành phố Busan\n\nCách biển Gwabggalli và Haeundae khoảng 30 phút đi tầu điện ngầm\n\nGần sân bay quốc tế Gimhae - chỉ mất 40 phút di chuyển",
        "c": null
      }
    ],
    "conditions": [
      "Dưới 22 tuổi",
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
      "6 trong vòng 1 năm.",
      "Sau 1 năm chuyển tiếp lên chuyên ngành D2",
      "2 và học tiếp trong vòng 4 năm",
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC) - 하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "VTV, HCCT, BCIT"
  },
  "yeonseong": {
    "id": "yeonseong",
    "name": "YeonSung",
    "nameKr": "연성대학교",
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
      "catalog": "https://drive.google.com/file/d/1zxrl8VWiFVYxpP26OemGroLqYgo_Dh1j/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=ICVUWdCIUU4",
      "youtubeId": "ICVUWdCIUU4",
      "title": "우리의 꿈 in 연성｜연성대학교 Yeonsung University"
    },
    "location": "Địa chỉ: 34 Yanghwa-ro 37beon-gil, Manan-gu, Anyang-si, Gyeonggi-do, Hàn Quốc\n\nNằm tại quận Manan, thành phố Anyang (Gyeonggi), thuộc vùng thủ đô Seoul – kết nối thuận tiện bằng tàu, xe buýt, có shuttle bus từ ga Anyang .",
    "intro": "- Tên tiếng Hàn: 연성대학교\n- Tên tiếng Anh: Yeonsung University\n\nThành lập:\n- 15/3/1977 – bắt đầu là Anyang Industrial Technical School\n- 1979 chuyển thành trường cao đẳng kỹ thuật\n- 1998 đổi tên thành Anyang Science University\n- 1/5/2012 – đổi tên chính thức thành Yeonsung University \nLoại hình: Tư thục, cao đẳng nghề chuyên biệt (junior college) .\nQuy mô (2018): khoảng 5.800 sinh viên; ~156 giảng viên chính quy và 300 giảng viên thỉnh giảng\n\nKhuôn viên: Diện tích khoảng 202.000 m², gồm thư viện, 9 tòa nhà học thuật, ký túc xá, nhiều phòng lab chuyên ngành & phòng thực hành, sân thể thao .\nTiện ích: Quầy cà phê (Gem Café), căng-tin, food court, career lounge, maker space, VR/STUDIO/CS studio, hội trường, shuttle bus… \nDịch vụ sinh viên: Tư vấn nghề nghiệp – học tập cá nhân hóa (AI), hỗ trợ tâm lý, thiết kế portfolio, chuẩn bị xin việc .\nCải thiện chất lượng: Năm 2023, cải tổ đa dạng thực đơn căn tin (từ 2 lên ~40 món/phục vụ) sau hiệu ứng truyền thông \n\nLiên kết với hơn 43 trường đối tác tại 14 quốc gia – châu Âu, châu Á, Mỹ... nhằm trao đổi học thuật, thực tập quốc tế .\nĐịnh hướng nghề nghiệp gắn liền với doanh nghiệp qua chương trình P-TECH, tích hợp kỹ năng thực tiễn và chuyển tiếp nghề nghiệp",
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "HNC, HPC, HCCT, SGT, BCIT, VTV, TVU"
  },
  "jangan": {
    "id": "jangan",
    "name": "JANGAN -",
    "nameKr": "장안대학교",
    "nameEn": "Jangan University",
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
      "catalog": "https://drive.google.com/file/d/1jsfqYFqutBEEYEvj1SQencT5CXrl739u/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1o0CVAeuFIYi1wCI2BB-fh7rNQU7UcS1f/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=LNZrEeexbpU",
      "youtubeId": "LNZrEeexbpU",
      "title": "Welcome to Jangan University"
    },
    "location": "1182, Samcheonbyeongma- ro, Bongdam-eup, Hwaseong-si, Gyeonggi-do, Hàn Quốc",
    "intro": [
      {
        "t": "Tên tiếng Hàn: 장안대학교\nTên tiếng Anh: Jangan University",
        "c": null
      },
      {
        "t": "\nNăm thành lập: 1978\nLoại hình: Tư thục\nSố sinh viên: 7.049 người\nĐịa điểm: 1182, Samcheonbyeongma-ro, Bongdam-eup, Hwaseong-si, Gyeonggi- do, Hàn Quốc\n \nWebsite: ",
        "c": null
      },
      {
        "t": "https://www.jangan.ac.kr/jangan/index.do?utm_source=copilot.com\n\n",
        "c": "#1155CC"
      },
      {
        "t": "- Trường có đa dạng các khoa, ngành phù hợp với nhu cầu giáo dục và thực tiễn xa hội như ngôn ngữ, logistic, công nghệ thông tin, quản trị khách sạn, nghệ thuật...\n- Trường hợp tác đào tạo với nhiều trường đại học lớn trong và ngoài nước như: Đại học Shepherd ( Hoa Kỳ), Đại học Konkuk ( Hàn Quốc), Đại học Namseoul ( Hàn Quốc), Đại học ngôn ngữ và Văn hóa Bắc Kinh ( Trung Quốc)...\n- Trường được chọn là trường đại học xuất sắc cho dự án \" Tăng cường năng lực giáo dục năm 2010\"\n- Trường được chọn hỗ trợ cho dự án đào tạo việc làm ở nước ngoài (K- Move) ( năm 2015)\n- Trường được Bộ giáo dục chọn làm cơ sở ủy thác giáo dục nghề nghiệp cho học sinh năm hai các trường phổ thông lên cao đẳng năm ( 2017)",
        "c": null
      }
    ],
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3",
      "Có bằng tốt nghiệp cấp 3 ( GPA 5.0)",
      "Trượt các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Số buổi nghỉ không quá 30 buổi",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm",
      "Có chứng chỉ TOPIK 2 hoặc Jejong 2b. (Fastgo có hỗ trợ Sejong 2b) - Với kỳ tháng 03/2026 không yêu cầu chứng chỉ."
    ],
    "majors": [
      "Quản lý khách sạn: Hotel Management (호텔관리학과)",
      "Làm đẹp: Beauty & Aesthetics ( 미용학과)"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng.",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "1 học kỳ ( 6 tháng ) - 1.700.000 KRW",
    "insurance": "",
    "ktx": "KTX: 1 học kỳ ( 6 tháng ) - 900.000 KRW\nPhí bảo hiểm: 90.000 KRW\nPhí đăng ký: - 30.000 KRW",
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
      "Xác nhân số dư sổ tiết kiệm sổ 18.000.000 KRW đứng tên học sinh\n\nSổ chứng minh tài chính khi nộp xin Visa ( Sổ gốc )\n- Mở sổ tài khoản 250 triệu.\n- Thời hạn sổ 1 năm\n- Đứng tên học sinh\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn ).\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á VÀ NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
    "documentsNote": "",
    "partners": [
      {
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": ""
  },
  "induk": {
    "id": "induk",
    "name": "Induk",
    "nameKr": "인덕대학교",
    "nameEn": "Induk University Học ít -",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 100,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "https://drive.google.com/file/d/1_bc1jra3dZGwxyewx7WIVu3npbA-RGRJ/view?usp=sharing"
    },
    "video": {
      "url": "http://youtube.com/watch?time_continue=4&v=soSsIjUR3tE&embeds_referring_euri=https%3A%2F%2Fedu.induk.ac.kr%2F&source_ve_path=MjM4NTE",
      "youtubeId": "soSsIjUR3tE",
      "title": ""
    },
    "location": "12 Choansan-ro, Wolgye‑dong, Nowon‑gu, Seoul 01878, Hàn Quốc",
    "intro": "Đại học tư thục, dạng cao đẳng – chuyên đào tạo bằng cao đẳng và chứng chỉ nghề chuyên sâu\nDiện tích trường khoảng 76.000 m² (khoảng 7,6 ha).\nGồm khoảng 10 tòa nhà học tập và ký túc xá; có cả trường PTTH công nghệ cùng hệ thống\nKhoảng 8.600 sinh viên; 160 giảng viên chính thức và 290 giảng viên thỉnh giảng\n\nChuyên ngành:\nCó 6 khoa chính: Smart ICT, Smart City, Creative Design, Broadcasting & Culture Contents, Global Business, Physical Education... với tổng cộng 33 ngành học (hai và ba năm)\n\nGiao thông & đi lại\nTàu điện ngầm:\nGa Wolgye – tuyến số 1, ngắn khoảng 5 phút đi bộ tới trường.\nTừ ga Changdong (số 4), chuyển sang số 1 đến Wolgye.\nCách ga Hagye (tuyến 7) một chút, kết nối qua xe buýt \n\nXe buýt: Tuyến 100, 172, 1137, 1140, 1161 dừng ngay trước trường \n\nXe hơi: Dễ tiếp cận từ các tuyến đường cao tốc Đông Bắc và các cầu vượt gần đó",
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% trong suốt quá trình học cho đến khi tốt nghiệp\n\nHọc phí dự kiến 1.543.500 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 2 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều",
    "insurance": "",
    "ktx": "•  KTX: 4 người/1 phòng( không bao gồm ăn)\nLưu ý: \n- KTX dành cho nữ 200,000 KRW/1 tháng ở trong khuôn viên trường. ( 16 tuần học và 8 tuần nghỉ ).\n- KTX dành cho nam 250,000 KRW/1 tháng, cách trường 20 phút đi tầu. ( 16 tuần học và  8 tuần nghỉ ).\n•  Chi phí nhập học: 214.000 KRW ( Chưa bao gồm tiền chăn gối, sách)\n*  Phí xe buýt đón: 30.000 KRW\n*  Phí đăng ký cư trú: 34.000 KRW\n*  Bảo hiểm: 100.000 KRW\n*  Trải nghiệm văn hóa: 50.000 KRW",
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
      "Xác nhân số dư tài khoản 13 triệu won (Sổ đứng tên học sinh, số dư tối thiểu 13 triệu won trở lên \nGiấy chứng nhận được cấp trong vòng 1 tháng trước khi nộp hồ sơ)"
    ],
    "documentsNote": "",
    "partners": [
      {
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "HNC, VTV, TVU, SGT, BCIT"
  },
  "osan": {
    "id": "osan",
    "name": "Osan",
    "nameKr": "오산대학교",
    "nameEn": "Osan University",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 100,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "https://drive.google.com/file/d/14ClpFkKAHstGFOanMnvrial_ymNzoINW/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1Bub6LJ2J5l3Nd4NqdKE5vp-czKspqc-Z/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=T_9dB0ObZiE",
      "youtubeId": "T_9dB0ObZiE",
      "title": "[오산대학교 국제교류원] 한국어학당 호텔조리계열 학과 체험｜오산대학교 Osan University"
    },
    "location": "45 Cheonghak-ro, Osan-si, Gyeonggi-do, Hàn Quốc (cách Seoul 35 km về phía Nam )",
    "intro": "*Trường hàng đầu tỉnh Gyeonggi\n- Tên tiếng Hàn: 오산대학교\n- Tên tiếng Anh: Osan University\n- Năm thành lập: 1978\n- Loại trường: Đại học tư thục\n- Chuyên ngành tiêu biểu:Kỹ thuật, công nghệ\n- Học bổng: Có\n- Website: www.osan.ac.kr/\n- Là trường tư thục tọa lạc tại tỉnh Gyeonggi, với lịch sử phát triển 43 năm và đầu tư vào chất lượng giáo dục là trường Đại học được nhiều du học sinh quốc tế lựa chọn theo học. Với vị trí thuận lợi không quá xa trung tâm cách thủ đô Seoul 35km về phía nam.\n- Trường được thành lập vào năm 1978 với tên gọi Cao đẳng Công nghệ Kỹ thuật Osan.\n- Trường hiện đang đối tác với Cao đẳng Nghề Công nghiệp Hà Nội và Cao đẳng Nghề Công nghề Thành phố Hồ Chí Minh và 1 số trường khác.\n- Xếp thứ 32 trường có tỷ lệ việc làm ở 57,3% theo công của Bộ Giáo dục.",
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
      "Giấy khám sức khoẻ lao phổi song ngữ ( 2 Bản : 1 Bản nộp trưởng + 1 Bản nộp ĐSQ khi xin visa )\nLưu ý: Tất cả các bản đều là dịch công chứng   \n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
    "documentsNote": "",
    "partners": [
      {
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "HNC, HPC, SGT"
  },
  "suncheon-jeil": {
    "id": "suncheon-jeil",
    "name": "Suncheon Jeil",
    "nameKr": "순천제일",
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
      "catalog": "https://drive.google.com/file/d/1jeLs-moW3bI0St6UxQTlPPxPvaHPWJ_b/view?usp=sharing"
    },
    "video": {
      "url": "",
      "youtubeId": "",
      "title": ""
    },
    "location": "17 Jeildaehak-gil, Deogwol-dong, Suncheon-si, Jeollanam-do, 57997, Hàn Quốc",
    "intro": "- Tên tiếng Hàn: 순천제일　\n- Tên tiếng Anh: Suncheon Jeil College\n\nThành lập: Năm 1978–1979 (ban đầu là Cao đẳng Kỹ thuật), đổi tên thành Suncheon Jeil College từ năm 1998–2012 \nstudyinkorea.go.kr\n\nLoại hình: Tư thục, cao đẳng chuyên đào tạo nghề.\n\nQuy mô: Hơn 4.000 sinh viên; hơn 200 giảng viên\n\nHệ Cao đẳng\nCó nhiều khoa: Kỹ thuật (xây dựng, điện tử, ô tô…), Khoa học tự nhiên, Y tế & Phúc lợi, Nghệ thuật & Dịch vụ…",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 6,3 )",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": [
      {
        "t": "Đi theo diện D2-6 được nhận học bổng của trường giảm 50% trong suốt quá trình học cho đến khi tốt nghiệp\n\nHọc phí dự kiến 1.600.000 KRW/6 tháng ( Tiếng + Chuyên Ngành ) đã giảm 50%\n\n1 Tuần chỉ phải học 1 đến 3 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 1 đến 2 tiếng\n\n",
        "c": null
      },
      {
        "t": "Lưu ý: Khi nhập cảnh sang trường - Học sinh phải đóng 800.000 won phí đăng ký cho trường bằng tiền mặt",
        "c": "#FF0000"
      }
    ],
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "HNC, VTV, TVU, SGT, BCIT, HPC"
  },
  "dongnam": {
    "id": "dongnam",
    "name": "Dongnam",
    "nameKr": "동남보건대학교",
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
      "catalog": "https://drive.google.com/file/d/1vHfckqZeJd4u1uyE29S2lRpEaOBjcboa/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1cLfJVZRcOwMEQ8W_WC6hxNKzr9IOZYIQ/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=bkqSSQmOWUQ",
      "youtubeId": "bkqSSQmOWUQ",
      "title": "동남보건대학교 건학50주년 기념식 영상"
    },
    "location": "Địa chỉ: 50 Cheoncheon‑ro 74‑gil, Jeongja‑dong, Jangan‑gu, Suwon‑si, Gyeonggi‑do, Hàn Quốc\n\nNằm ở phía bắc Suwon, trên bờ sông Seohocheon, trong khu vực đô thị thuận tiện di chuyển bằng bus và đi tới Seoul rất dễ dàng",
    "intro": "- Tên tiếng Hàn: 동남보건대학교\n- Tên tiếng Anh: Dongnam Health University\n\nThành lập:\nNgày 19/12/1973 dưới tên Dongnam Health Junior School \nTrở thành trường cao đẳng năm 1979, đổi tên thành đại học vào năm 1998 và 2012.\nLoại hình: Đại học chuyên đào tạo chuyên môn, tư thục.\nLãnh đạo hiện nay: Chủ tịch Lee Young Kwon (이영권) \nQuy mô (đến 2023): khoảng 4.685 sinh viên, 122 giảng viên chính quy và 258 giảng viên thỉnh giảng\n\nCơ sở: 9 tòa nhà học thuật gần công viên Jeongja, thư viện, phòng lab, ký túc xá, thư viện kỹ thuật cao cấp \nHoạt động được cấp phép:\nĐược Bộ Giáo dục Hàn Quốc chọn là trường chất lượng (2 đợt hỗ trợ đổi mới), đạt chứng nhận đào tạo điều dưỡng y tế .\nTrường thuộc nhóm được cấp “giấy chứng nhận chất lượng giáo dục nghề” \n\nTỷ lệ sinh viên/giảng viên: ~38 sinh viên cho mỗi giảng viên chính quy.\nTài chính & bộ hỗ trợ: Kinh phí trung bình đào tạo một sinh viên ~937.000 KRW/năm; nhận hỗ trợ từ chính phủ giai đoạn 2022–2024 .\nXếp hạng học thuật:\nTheo AD Scientific Index (2025): xếp #240 tại Hàn Quốc, #10.113 châu Á, 18.687 thế giới",
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "HNC, HPC, HCCT, SGT, BCIT"
  },
  "kyunggin": {
    "id": "kyunggin",
    "name": "KyungGin -",
    "nameKr": "경인여자대학교",
    "nameEn": "Kyungin Women’s University (KIWU)",
    "system": "D2-6 > D2-1 (Cao Đẳng )",
    "quota": 100,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "https://drive.google.com/file/d/13LjLRc-M2OLW1Hb6_jefzRMeLwDdl5LU/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/10CcsykZ3i9g7F_O6EtgGsBLt5j9AlPm0/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=WGURKKrAXPo",
      "youtubeId": "WGURKKrAXPo",
      "title": "경인의 설립이념, 상징에 대해 알아보아요ㅣ경인여대 오리엔테이션"
    },
    "location": "63 Gyeyangsan-ro, Gyesan-dong, Gyeyang-gu, Incheon, Hàn Quốc",
    "intro": [
      {
        "t": "- Tên tiếng anh: Kyungin Women’s University (KIWU).\n- Tên tiếng Hàn: 경인여자대학교",
        "c": null
      },
      {
        "t": "\n- Năm thành lập: Năm 1992.\n- Loại hình: tư thục.\n- Số sinh viên: khoảng 4.500\n- Điện thoại: 031-540-0114\n- Website: ",
        "c": null
      },
      {
        "t": "https://www.kiwu.ac.kr/\n\n",
        "c": "#1155CC"
      },
      {
        "t": "1: Top 3 Nữ sinh Incheon & Visa thẳng: Thành lập năm 1992 tại Incheon, Đại học Nữ sinh Kyungin là trường tư thục hàng đầu dành cho nữ sinh tại Hàn Quốc, xếp top 3 trường nữ sinh tốt nhất Incheon. Trường được Bộ Giáo dục Hàn Quốc công nhận là “Đại học Xuất sắc” (2014-2020) và thuộc top 1% visa thẳng (2018), giúp sinh viên Việt Nam nhập học dễ dàng mà không cần phỏng vấn hay đóng băng tài khoản 10,000 USD.\n2: Vị trí chiến lược: Tọa lạc tại Incheon, gần sân bay quốc tế Incheon (~30 phút), KIWU nằm trong khu vực sầm uất với trung tâm thương mại lớn nhất Hàn Quốc và chi phí sinh hoạt thấp hơn Seoul (~60-70%). Incheon cách Seoul ~40 phút tàu điện, thuận tiện di chuyển. Cộng đồng sinh viên quốc tế tại đây khoảng 300 người, trong đó ~100 sinh viên Việt Nam (2023).\n3: Thế mạnh đào tạo: KIWU nổi bật với các ngành phù hợp nữ giới: \n- Điều dưỡng: Xếp hạng A về đào tạo (2018), hợp tác với các bệnh viện lớn.\n- Giáo dục mầm non: Đào tạo giáo viên mầm non hơn 30 năm.\n- Làm đẹp: Mỹ phẩm, Thẩm mỹ, Quản lý spa.\n- Thư ký & Kế toán thuế.\n- Du lịch & Khách sạn: Quản lý sự kiện, Dịch vụ hàng không. Trường có 4 khoa (Xã hội, Sức khỏe, Văn hóa, Kinh doanh) với hơn 20 chuyên ngành. Các chương trình giảng dạy kết hợp thực hành, đảm bảo tỷ lệ việc làm sau tốt nghiệp lên đến 80% (2018).",
        "c": null
      }
    ],
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": ""
  },
  "ajou-motor": {
    "id": "ajou-motor",
    "name": "AJOU MOTOR",
    "nameKr": "아주자동차대학",
    "nameEn": "Ajou Motor College",
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
      "catalog": "https://drive.google.com/file/d/11jo3OFyMIUoBd7hfQ0rpfEx5T8TFahib/view?usp=sharing",
      "invoice": "https://drive.google.com/file/d/1CT1fdNO3ToBX8lcUWheBYGz0wI_zvr2-/view?usp=sharing"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=9xTVfh-VaoA",
      "youtubeId": "9xTVfh-VaoA",
      "title": "Study Korea 300K!"
    },
    "location": "Địa chỉ: 106 Daehak-gil, Jupo‑myeon, Boryeong‑si, Chungcheongnam‑do, Hàn Quốc \n\nNằm trong khu vực công nghiệp Chungcheongnam‑do, cách Seoul khoảng 150 km về phía Nam",
    "intro": "- Tên tiếng Hàn: 아주자동차대학\n- Tên tiếng Anh: Ajou Motor College\n\nThành lập:\nBan đầu năm 1995 là Daecheon Technical College, vốn do Daewoo Educational Foundation sáng lập \nĐổi tên thành Ajou Motor College từ năm 2004 \nLoại hình: Cao đẳng nghề tư thục chuyên sâu về công nghệ ô tô\n\nCơ sở vật chất & thực hành\nTrường sở hữu xưởng thực hành, khu sản xuất, phòng lab kỹ thuật ô tô hiện đại (khoảng 720–3.488 m²) được xây dựng 1996–2001 \nCó ký túc xá và một số tòa nhà phúc lợi, thể thao đầy đủ trang thiết bị \n\nThành tích nổi bật\nLiên tục được Bộ Giáo dục và Bộ Lao động – Việc làm Hàn Quốc công nhận là trường đào tạo nghề xuất sắc và “World Class College” \nDẫn đầu mô hình hợp tác đại học – doanh nghiệp LINC",
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 5.0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 30 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [
      "Kỹ thuật ô tô toàn cầu - GLOBAL AUTOMOTIVE ENGINEERING"
    ],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng / Hoặc 1 năm (nếu học sinh có nhu cầu học tiếng thêm 6 tháng)",
      "Sau 6 tháng/1 năm chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
      "Điều kiện để tốt nghiệp > Có chứng chỉ Topik 3",
      "Số buổi nghỉ quá 4 buổi (không xin phép) sẽ không được chuyển đổi lên chuyên ngành"
    ],
    "tuition": [
      {
        "t": "Học phí dự kiến 3.440.000 KRW/1 kỳ\nƯu đãi áp dụng:\n- Học bổng: 50% - Chỉ còn 1,440,000원 kỳ đầu tiên (D2-6)\n- Học bổng: 40% - Chỉ còn 2,064,000원 kỳ thứ hai (D2-6)\n\n1 Tuần chỉ phải học 3 đến 4 buổi tùy thời điểm, mỗi buổi chỉ 1 buổi sáng hoặc 1 buổi chiều, mỗi buổi 2 đến 3 tiếng\n\n",
        "c": null
      },
      {
        "t": "Lưu ý: Ajou-Motor invoice sẽ là 1 năm D2-6, Nếu sau 6 tháng lên chuyên ngành nhà trường sẽ trả lại tiền cho học sinh",
        "c": "#FF0000"
      }
    ],
    "insurance": "",
    "ktx": "KTX: 910k won/6 tháng\nMiễn phí KTX kỳ 2 (D2-6)\nPhí bảo hiểm: 100kwon/6 tháng",
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
      "Hỗ trợ việc làm thêm trong trường có lương",
      "Được tạm hoãn nghĩa vụ quân sự."
    ],
    "documents": [
      "- Application đánh máy (In bản đánh máy + ký tên, scan lại bản có chữ ký)\n- Gửi bản word + PDF\n- Tiếng Hàn\n\nLưu ý bổ sung thêm trong quá trình làm Application:\n- 02 ảnh gia đình: chụp tất cả thành viên trong gia đình\n- 01 ảnh chụp trước cửa nhà\n- 01 ảnh chụp tại phòng khách\n- 02 ảnh chụp nghề nghiệp của bố + mẹ\n- Trường hợp ảnh chụp không đủ thành viên trong gia đình theo CT07 có thể nhờ hàng xóm đứng chụp cùng cho đủ thành viên.\n\nHồ sơ gửi trường sau PV bản cứng\n- Ảnh hộ chiếu. ( Scan + Photo )\n- Bản sao CMND/hộ chiếu của học sinh trao đổi (cả mặt trước và mặt sau). Scan + photo\n- Bản sao CMND/hộ chiếu của phụ huynh (cả mặt trước và mặt sau) Scan + Photo\n- Giấy khai sinh. (Scan + Photo )\n- Giấy chứng nhận quan hệ gia đình CT07 ( Scan + Dịch công chứng)\n- Ảnh gia đình (bao gồm ảnh nơi làm việc của phụ huynh)\n- Giấy xác nhận nghề nghiệp và thu nhập của phụ huynh ( Scan + dịch công chứng )\n- Giấy tờ nhập học tại trường đại học ở nước sở tại trong ít nhất 1 học kỳ (giấy chứng nhận đang học, bảng điểm, thư giới thiệu từ trường đại học) Dịch thuật công chứng Scan + Photo\n- Chứng nhận điểm TOPIK, Sejong hoặc điểm tiếng Anh nếu có ( Scan + Photo)\n- Đơn đồng ý tham gia chương trình trao đổi sinh viên AMC \nhttps://docs.google.com/document/d/19atDqax_IlG1ysvZvbOI0FPOOIEdChH1/edit#heading=h.k684d24wo1s1\n- Đơn xin hoàn phí (bao gồm sổ ngân hàng, bản sao CMND/hộ chiếu, số tài khoản – nếu điền sai sẽ không chịu trách nhiệm)\nhttps://docs.google.com/document/d/1Nq1mK5ZvRfnmU52MV7SuzjkZy11DsWCH/edit?rtpof=true&sd=true&tab=t.0\n- Bản cam kết của đại diện chương trình du học (Study Abroad Program Representative’s Pledge)\nhttps://drive.google.com/file/d/1WjAlc3Khg6BLwb5Hfth42lMg1mbdwqdI/view\nGiấy xác nhận số dư tài khoản chi phí du học \n+ Xác nhận số dư sổ tài khoản 400 triệu ngân hàng:\n+ Thời hạn đáo sổ 1 năm\n+ Đứng tên học sinh\n\nLưu ý sổ nộp ĐSQ/LSQ: \n- Tham gia chương trình không yêu cầu sổ lùi, nhưng an toàn hơn thì mở trước 1 tháng - Số tiền CMTC khi nộp hồ sơ xin Visa là 250 triệu/300 triệu.\n- Tem tím có 4 tím tem + Mỗi loại 2 = Tổng 8 tem bắt buộc ( 1 bản nộp ĐSQ + 1 bản sau này mang sang trường Hàn )\n- KHÔNG MỞ SỔ CMTC TẠI NGÂN HÀNG BẮC Á và NGÂN HÀNG CHÍNH SÁCH XÃ HỘI"
    ],
    "documentsNote": "",
    "partners": [
      {
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": "TVU, BCIT"
  },
  "daewon": {
    "id": "daewon",
    "name": "Daewon",
    "nameKr": "대원대학교",
    "nameEn": "Daewon College New",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 100,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "https://drive.google.com/file/d/17MFnGZQOPPJZXYR-2XmrA-1NAzH0v13P/view?usp=sharing"
    },
    "video": {
      "url": "",
      "youtubeId": "",
      "title": ""
    },
    "location": "Địa chỉ: 316 Daehak-ro, Sinwol-dong, Jecheon, tỉnh Chungcheongbuk, Hàn Quốc\n\nVị trí : Thành phố Jecheon, tỉnh Bắc Chungcheong, Hàn Quốc. (cách thủ đô Seoul khoảng 2 giờ tàu điện)",
    "intro": "- Tên tiếng Hàn: 대원대학교\n- Tên tiếng Anh: Daewon  College\n\nThành lập: năm 1995\n\nLoại hình:  tư thục\n\nQuy mô: ~3.000 sinh viên \nGiáo sư  và cán bộ nhân viên: 92 giáo sư, 50 nhân viên \nWebsite: https://www.daewon.ac.kr/mbs/daewon/\n \nVới không gian campus rộng rãi, thoáng mát có tộng cộng 23 khoa ( chuyên ngành ) và hơn 3000 học sinh đang theo học.\nTrường cung cấp các dịch vụ hỗ trợ học tập, tư vấn nghề nghiệp, hỗ trợ tìm việc làm và hoạt động thực tập gắn với doanh nghiệp nhằm giúp sinh viên chuẩn bị tốt cho việc ra trường và tìm việc. Nhiều chương trình hướng nghiệp, workshop và tư vấn CV được tổ chức thường xuyên\n\nChất lượng & cải tiến: \nTrong gần 30 năm hoạt động, Daewon College luôn đổi mới chương trình đào tạo, chú trọng thực hành kỹ năng và gắn kết với nhu cầu thị trường lao động. Tỷ lệ sinh viên có việc làm sau tốt nghiệp khá cao nhờ hệ thống kết nối doanh nghiệp và chương trình đào tạo ứng dụng.\n\nLiên kết quốc tế:\nTrường có nhiều cơ hội hợp tác và trao đổi học thuật, thực tập với các tổ chức, doanh nghiệp trong và ngoài nước (đa phần tập trung vào thực hành nghề và kết nối việc làm).\n\nĐịnh hướng nghề nghiệp:\nĐịnh hướng đào tạo của Daewon College luôn gắn liền với nhu cầu thực tế của doanh nghiệp và thị trường lao động.\nHỗ trợ việc làm theo diện E-7 liên kết trực tiếp với Công ty Samsung  Heavy Industries\nHội đồng công ty đối tác nội bộ Công ty HD Huyndai Heavy Industries.\nCác Công ty nguyên vật liệu Jecheon ( lljin Global, INFAC, YuYu Pharma .....\n\nNăm 2000 trường được Cục quản lý Doanh nghiệp Vừa và nhỏ chỉ định là Trường trị doanh nghiệp Vừa và Nhỏ ( TRITAS), và được Bộ giáo dục chọn làm trường đại học cơ sở cho các dự án chuyên ngành và ngành công nghiệp địa phương.",
    "conditions": [
      "Dưới 24 tuổi",
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
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": ""
  },
  "nubusan": {
    "id": "nubusan",
    "name": "Nữ Busan",
    "nameKr": "부산여자대학교",
    "nameEn": "Busan Women's  College  New",
    "system": "D2-6 > D2-1 (Cao Đẳng)",
    "quota": 100,
    "images": {
      "main": "images/placeholder.svg",
      "catalog": "",
      "locationMap": "",
      "invoice": "",
      "gallery": []
    },
    "links": {
      "website": "",
      "catalog": "https://drive.google.com/file/d/1kUaBnz51NrUtELKTHt-ZBhFvt7TYp62s/view?usp=sharing",
      "invoice": "https://drive.google.com/drive/u/0/home"
    },
    "video": {
      "url": "https://www.youtube.com/watch?v=TdAzIBDSJ8A",
      "youtubeId": "TdAzIBDSJ8A",
      "title": "부산여자대학교 홍보영상"
    },
    "location": "Địa chỉ: 516 đường Jinman , Phường Yangjeong, quận Busanjin, Busan, Hàn Quốc\n\nTọa lạc tại vị trí chiến lược giáp Seomyeon, trung tâm Busan thành phố lớn thứ 2 tại Hàn Quốc ( dưới 10 phút di chuyển)",
    "intro": [
      {
        "t": "- Tên tiếng Hàn: 부산여자대학교\n- Tên tiếng Anh: Busan Women's College \n\nThành lập: năm 1969 Trường Nữ Sinh Busan Hàn Quốc được thành lập với tên gọi đầu tiên là Trường Trung học Nữ Busan.\nNăm 2012 trường được đổi tên thành Cao Đẳng Nữ Sinh Busan.\n\nLoại hình:  tư thục\nQuy mô: ~2877 sinh viên\nGiáo sư  và cán bộ nhân viên: 290 giáo sư \n\nWebsite: https: ",
        "c": null
      },
      {
        "t": "http://www.bwc.ac.kr",
        "c": "#1155CC"
      },
      {
        "t": "\n \nTrong suốt quá trình gần 60 năm hình thành và phát triển, trường đã mở rộng các chương trình đào tạo bao gồm các ngành như giáo dục mần non, du lịch, khách sạn, y tế và phúc lợi xã hội. \n\n. Xếp thứ hạng 171/193 TOP trường Đại học / Cao đẳng Hàn Quốc.\n. Xếp hạng 9676/14131 trường Đại học/ Cao đẳng trên toàn thế giới.\nSố lượng sinh viên đang theo học ~ 3.000 sinh viên.\n\nTừ năm 2011~ 2012 trường được Bộ Giáo Dục, khoa học công nghệ Hàn Quốc bình chọn tham gia thí điểm Dự Án Tăng Cường Năng Lực Giáo Dục Cao Đẳng.\n\nTrung tâm Hỗ trợ việc làm và khởi nghiệp tại trường cung cấp nhiều thông tin bổ ích về nghề nghiệp , việc làm và thông tin khởi nghiệp cho sinh viên.\nNăm 2021, Viện Đánh Giá Và Chứng Nhận Đào Tạo Nghề chứng nhậ Cao Đẳng Nữ Busan là Cao Đẳng có chất lượng đào tạo nghề Cao Cấp.\n\n. Thông qua Trung tâm Tư Vấn Đời Sống Sinh Viên, nhà trường tổ chức các buổi tư vấn tâm lý giúp sinh viên giải quyết nhanh chóng các vấn đề và mối quan tâm của mình.",
        "c": null
      }
    ],
    "conditions": [
      "Dưới 24 tuổi",
      "Có học bạ cấp 3 ( GPA 5,0 )",
      "Có bằng tốt nghiệp cấp 3",
      "Số buổi nghỉ không quá 15 buổi",
      "Trượt Visa các hệ D4-1, D2-1, D2-2, D2-3, E9",
      "Không phân biệt vùng miền",
      "Có sức khỏe tốt không mắc các bệnh truyền nhiễm"
    ],
    "majors": [],
    "conversion": [
      "Học D2-6 trong vòng 6 tháng > Thi topik trường nếu chưa có chứng chỉ tiếng Topik2",
      "Sau 6 tháng chuyển tiếp lên chuyên ngành D2",
      "1 và học tiếp trong vòng 2 năm",
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
    "documentsNote": "",
    "partners": [
      {
        "code": "SGT",
        "name": "Trường Cao Đẳng Công Nghệ Sài Gòn",
        "nameKr": "사이공기술대학"
      },
      {
        "code": "VTV",
        "name": "VTV College- Cao đăng truyền hình",
        "nameKr": "방송대학교"
      },
      {
        "code": "UTM",
        "name": "University of Technology and Management- Trường Đại học Công",
        "nameKr": "후응이기술경영대학교"
      },
      {
        "code": "HNC",
        "name": "Huu Nghi College- Cao đẳng Hữu Nghị",
        "nameKr": "후응이대학"
      },
      {
        "code": "HPC",
        "name": "Ha Noi Polytechnic College (HPC)-하노이 폴리텍 대학 (HPC)",
        "nameKr": "하노이"
      },
      {
        "code": "HCCT",
        "name": "Cao đẳng thương mại và du lịch hà nội College of Commerce an",
        "nameKr": "하노이 관광상업대학"
      },
      {
        "code": "BCIT",
        "name": "Trường cao đẳng kĩ thuật công nghiệp - College of Industrial",
        "nameKr": "산업기술대학"
      }
    ],
    "mou": ""
  }
};

const EXTRA_SHEETS = {
  "visaChecklist": {
    "name": "Check list HS xin Visa D2-6",
    "items": [
      {
        "stt": "1.0",
        "noidung": "Application Form Đại Sứ Quán",
        "luuy": "Theo mẫu của ĐSQ",
        "link": "https://drive.google.com/file/d/1mOuSY9LJ96aUAHi1HVdg6gAEfKUibBG5/view?usp=drive_link",
        "linkText": "ĐƠN XIN CẤP VISA - MẪU.pdf"
      },
      {
        "stt": "2.0",
        "noidung": "Đơn xác nhận lịch sử bị từ chối visa",
        "luuy": "Theo mẫu của ĐSQ",
        "link": "https://drive.google.com/file/d/1fauwDZG0Bn8choin_HL1NmvlykBgwgS8/view?usp=sharing",
        "linkText": "đơn xác nhận từ chối visa.pdf"
      },
      {
        "stt": "3.0",
        "noidung": "Thư mời nhập học của trường Hàn",
        "luuy": "Bản photo",
        "link": "https://drive.google.com/file/d/1YV_HuEU5ciXk-4b17_1i-mUwUvsf7MZX/view?usp=drive_link",
        "linkText": "Thư mời nhập học mẫu.pdf"
      },
      {
        "stt": "4.0",
        "noidung": "Đăng ký kinh doanh trường Hàn",
        "luuy": "Bản photo",
        "link": "https://drive.google.com/file/d/1D-B78axRJPrjl_yVSVB_ILIb61bvbGGm/view?usp=sharing",
        "linkText": "ĐKKKD các trường.rar"
      },
      {
        "stt": "5.0",
        "noidung": "MOU trường",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "6.0",
        "noidung": "Quyết định trao đổi sinh viên",
        "luuy": "Dịch thuật + công thức",
        "link": "https://drive.google.com/file/d/1pruBz5KhQCmzB5SDvS4a5MYshNu44M5G/view?usp=sharing",
        "linkText": "THƯ TIẾN CỬ HN - YEONSUNG.pdf\nTHƯ TIẾN CỬ HỮU NGHỊ-1.pdf"
      },
      {
        "stt": "7.0",
        "noidung": "Giấy khám sức khỏe",
        "luuy": "Sẽ phải khám sức khỏe:\n1: Khi nộp hồ sơ xin Visa ĐSQ/LSQ lao Phổi\n2: Trước khi xuất cảnh 1 tuần khám lao phổi + Bổ sung viêm gan B",
        "link": "https://drive.google.com/file/d/1shrNiARmVwwsoc3yC41hQ3ThMww82_Fy/view?usp=drive_link",
        "linkText": "Full khám sức khỏe.pdf"
      },
      {
        "stt": "8.0",
        "noidung": "Kế hoạch học tập + Giới thiệu bản thân nộp ĐSQ",
        "luuy": "Cần viết theo chuẩn mẫu Fastgo hướng dẫn - Bản viết tay",
        "link": "https://docs.google.com/document/d/1t0hYDN6VpAb0_DnpOq12AslI7hIsg5Ae/edit?usp=drive_link&ouid=101568109108732934964&rtpof=true&sd=true",
        "linkText": "GTBT+ KHHT Phạm Đình Tùng Dương.docx"
      },
      {
        "stt": "9.0",
        "noidung": "Tem tím bằng TN",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "10.0",
        "noidung": "Tem tím học bạ THPT",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "11.0",
        "noidung": "Tem tím bảng điểm ĐH/ CĐ",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "12.0",
        "noidung": "Tem tím Xác nhận sinh viên",
        "luuy": "2 bản",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "13.0",
        "noidung": "Sổ tiết kiệm của học sinh",
        "luuy": "- Đứng tên học sinh \n- Đáo hạn sổ: 1 năm\n- Số tiền tối thiểu: 300 triệu\n- Không yêu cầu sổ lùi\n- Xác nhận số dư đi kèm",
        "link": "",
        "linkText": "- Sổ đứng tên HỌC SINH\n- Trừ các ngân hàng: BẮC Á, CHÍNH SÁCH XÃ HỘI"
      },
      {
        "stt": "14.0",
        "noidung": "Xác nhận thu nhập, bảng lương và bảo hiểm xã hội",
        "luuy": "Dịch thuật công chứng",
        "link": "https://drive.google.com/file/d/1w-PdkpGB54V6trqqKqnLbp1y89abP4Rg/view?usp=sharing",
        "linkText": "XAC NHAN CONG VIEC.pdf"
      },
      {
        "stt": "15.0",
        "noidung": "Hợp đồng nghề nghiệp / Giấy xác nhận công việc",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "16.0",
        "noidung": "Sao kê TK bố",
        "luuy": "Trước 10 ngày nộp xin Visa - Sao kê trong vòng 6 tháng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "17.0",
        "noidung": "Sao kê TK mẹ",
        "luuy": "Trước 10 ngày nộp xin Visa - Sao kê trong vòng 6 tháng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "18.0",
        "noidung": "Sổ đỏ",
        "luuy": "Càng nhiều càng tốt",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "19.0",
        "noidung": "Giải trình ĐKKD nếu có",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "20.0",
        "noidung": "Giải trình sao kê",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "21.0",
        "noidung": "Giải trình địa chỉ",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "22.0",
        "noidung": "Cam kết bảo lãnh tài chính",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "23.0",
        "noidung": "Giấy khai sinh",
        "luuy": "Dịch thuật công chứng",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "24.0",
        "noidung": "CTO7",
        "luuy": "Phải chuẩn form của ĐSQ yêu cầu",
        "link": "https://drive.google.com/file/d/1U7tfpq-yLbdCIG85904PrGHsJ3sSG3z3/view?usp=drive_link",
        "linkText": "quy chuẩn CT07.pdf"
      },
      {
        "stt": "25.0",
        "noidung": "Photo hộ chiếu",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "26.0",
        "noidung": "CCCD Học sinh",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "27.0",
        "noidung": "CCCD Bố",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "28.0",
        "noidung": "CCCD Mẹ",
        "luuy": "Bản photo",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "29.0",
        "noidung": "Giấy Xác nhận sinh viên ( bản gốc )",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "30.0",
        "noidung": "Bảng điểm Cao đẳng / Đại học * bản gốc )",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "31.0",
        "noidung": "Học bạ gốc",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "32.0",
        "noidung": "Bằng tốt nghiệp gốc",
        "luuy": "",
        "link": "",
        "linkText": ""
      },
      {
        "stt": "33.0",
        "noidung": "Bảo hiểm nhân thọ của bố/mẹ",
        "luuy": "Nên bổ sung nếu có > ĐSQ/LSQ coi đây như 1 tài sản có giá trị",
        "link": "https://drive.google.com/file/d/1fnj2abldmc7lk4hw061VQ94DWTNmXItt/view?usp=sharing",
        "linkText": "bảo hiểm tham khảo.pdf"
      },
      {
        "stt": "33.0",
        "noidung": "Mẫu biên lai khi nộp xin Visa thành công",
        "luuy": "",
        "link": "https://drive.google.com/file/d/1ufZFMNn2SlW_sUXFi7BJ8rbMFTX3FKeg/view?usp=sharing",
        "linkText": "bien lai visa.pdf"
      },
      {
        "stt": "34.0",
        "noidung": "Full bộ hồ sơ chuẩn D2-6 nộp ĐSQ tham khảo",
        "luuy": "",
        "link": "https://drive.google.com/file/d/1MXhRJhF7h8TjTHtkNAi5-4saxNDoAQBZ/view?usp=sharing",
        "linkText": "3. NGUYỄN HỮU TRUNG D2-6 T9-2025.pdf"
      },
      {
        "stt": "35.0",
        "noidung": "Quy trình chứng minh tài chính Visa D2-6",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "https://drive.google.com/file/d/1_X-oqJGlvV2HfuSOhVM7O3obb4dnAPSh/view?usp=drive_link",
        "linkText": "Quy trình chứng minh tài chính.pdf"
      },
      {
        "stt": "36.0",
        "noidung": "Quy trình làm hồ sơ sau khi nhập cảnh",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "https://drive.google.com/file/d/1h7XuGU-R3h5pLBQ413_Ko_C2B6SLwytS/view?usp=drive_link",
        "linkText": "Quy trình làm hồ sơ sau khi nhập cảnh tại Hàn Quốc.pdf"
      },
      {
        "stt": "37.0",
        "noidung": "Địa chỉ khám sức khỏe theo ĐSQ quy định",
        "luuy": "Xem theo hướng dẫn >>>>>",
        "link": "https://drive.google.com/file/d/1wpetiA8wupIUAgHVtkMeUDsNGrJ8urTp/view?usp=sharing",
        "linkText": "Địa chỉ khám sức khỏe.jpg"
      }
    ]
  },
  "phongVan": {
    "name": "Tài liệu ôn phỏng vấn trường Hàn",
    "items": [
      {
        "stt": "1.0",
        "noidung": "Tài liệu ông luyên phỏng vấn",
        "link": "https://drive.google.com/file/d/1ckWFpSj5FG-CTnPA3pE3A36CApIKC4Lf/view?usp=sharing",
        "linkText": "THÔNG BÁO PHỎNG VẤN TRƯỜNG.pdf"
      },
      {
        "stt": "2.0",
        "noidung": "Clip tham khảo",
        "link": "https://drive.google.com/file/d/1QJy9dS7d-wr8tNzrSEgmPJ4iP2c336Ak/view?usp=sharing",
        "linkText": "Mẫu clip PV trường Hàn.mp4"
      },
      {
        "stt": "",
        "noidung": "",
        "link": "https://drive.google.com/file/d/1UC4_aIsvhw9GsFN_ja78mcc_9usa4FIa/view?usp=sharing",
        "linkText": "Mẫu Clip PV trường Hàn 2.mp4"
      },
      {
        "stt": "",
        "noidung": "",
        "link": "https://drive.google.com/file/d/1wKA6PhAJFAGrZOGQsEjSLulxlr6ohJB_/view?usp=sharing",
        "linkText": "Mẫu Clip PV trường Hàn 3.mp4"
      }
    ]
  },
  "application": {
    "name": "Application trường Hàn",
    "schools": [
      {
        "school": "Osan",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/1sO4ft9RfeeC_HEAI8KMmO9Ytnw3Alyip/edit?usp=drive_link&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "MẪU APPLICATION - OSAN.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/1G38zCU5AFhX5AbWUsPnF6DMRDTw1JreJ/view?usp=sharing",
            "linkText": "Dương Minh Chiến.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1-1Lct6uvl8bYMVxB6Zd3YSE10KNJLICZ/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Danh sách đăng ký trường Osan.xlsx"
          }
        ]
      },
      {
        "school": "Induk",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/1hY7eCKz3kcYAOdwUZ8Kl0S6g3OoQAn9g/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Application Form Induk.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/1-mumM6QeVj_Arshe5coPLWzSfObFFmIZ/view?usp=sharing",
            "linkText": "Bùi Phương Trinh.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/13wgCBvvJJBFrtXZmJVH90RKpqqGUR4I_/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "DANH SÁCH ĐĂNG KÝ TRƯỜNG INDUK.xlsx"
          }
        ]
      },
      {
        "school": "YeonSung",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/1ZkgNyyusXgVPvyM-CE7x2sqMlXAv5WoY/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Application Form Yeonsung.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/15xlrWsOTS42fTnXnJRQ51iHlk6Y1kFF8/view?usp=sharing",
            "linkText": "Lương Trọng Mạnh.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1EXIzeyF3U6kxgPmnwkaleVRnLP80afb_/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "DANH SÁCH ĐĂNG KÝ TRƯỜNG YEONSUNG.xlsx"
          }
        ]
      },
      {
        "school": "Sucheon Jeil",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://drive.google.com/file/d/1vbtolowKs_0-2_1UtdPyMshlqudolGHy/view?usp=sharing",
            "linkText": "Application Form_Suncheon.pdf"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/1F6hqtbD7AvOBHFSHnCi7HajKxe9DIIcB/view?usp=sharing",
            "linkText": "16. TANG VAN TIEM.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1GNszeAJLUNZOZl6M6MiEliD58e7SDlQ2/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "DANH SÁCH ĐĂNG KÝ TRƯỜNG SUNCHEON.xlsx"
          }
        ]
      },
      {
        "school": "Ajou-Motor",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/18FT_QROReZkQsdkp2YfRN1KpDbaGYTlo/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Application Form_Ajou.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/1wI_lX6B0akmQTQtZUkzcxd_y3XUd0QSm/view?usp=sharing",
            "linkText": "Trần Duy Hưng.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/17rMsw7KodE42nSpwE43EkNTLtLo-ayiD/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Danh sách đăng ký trường Ajou-Motor.xlsx"
          }
        ]
      },
      {
        "school": "Dongnam",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/1bxnpOvXs0ldPl6DTJdRxJJwM25rOx5gj/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Form - Aplication DONGNAM.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/19ob_M-E68Xe4xkifMXahN_1sTtRQqD1f/view?usp=sharing",
            "linkText": "Bui Thị Kim Oanh.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1LBPDPTgnq5tFKtuQFmYz6hn5fkuqjrm4/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "Danh sách đăng ký trường Dong-Nam.xlsx"
          }
        ]
      },
      {
        "school": "Dong-Eui",
        "items": [
          {
            "type": "Bản chuẩn cần làm ( Chỉ sửa phần bôi vàng )",
            "link": "https://docs.google.com/document/d/1T9o7crAxeDmIMB3o-_myMoVaUBIXzqa0/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "DEUapplicationform.doc"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "https://drive.google.com/file/d/1WylK2Kss5_MHqw5Uj-xU9x3pWufsx3uA/view?usp=sharing",
            "linkText": "Đỗ Quôc Cường.pdf"
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1fU3UDzfi5Yhdl9AdzTGKLdLk3ylCjkkA/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "DANH SÁCH ĐĂNG KÝ TRƯỜNG DONGEUI.xlsx"
          }
        ]
      },
      {
        "school": "KyungGin",
        "items": [
          {
            "type": "Bản chuẩn cần làm",
            "link": "https://docs.google.com/document/d/1qre5kJNvVu16DstdIeNo35B9j4QSvW7N/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "KyungGin.doc"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "",
            "linkText": ""
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1RPVI6F97mP2OO9KNtcm37_YEA7nRWO2d/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "D-2-6 KyungGin.xlsx"
          }
        ]
      },
      {
        "school": "Jangan",
        "items": [
          {
            "type": "Bản chuẩn cần làm",
            "link": "https://docs.google.com/document/d/1FbKYeotcWtxNFjysckljCnGMyKM9296p/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "JanGan.docx"
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "",
            "linkText": ""
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "https://docs.google.com/spreadsheets/d/1TB7YrGDPRKPxuXntQnbLfKYQSA0wDKaw/edit?usp=sharing&ouid=101568109108732934964&rtpof=true&sd=true",
            "linkText": "D-2-6 Jangan.xlsx"
          }
        ]
      },
      {
        "school": "Deawon",
        "items": [
          {
            "type": "Bản chuẩn cần làm",
            "link": "",
            "linkText": ""
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "",
            "linkText": ""
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "",
            "linkText": ""
          }
        ]
      },
      {
        "school": "Busan Women",
        "items": [
          {
            "type": "Bản chuẩn cần làm",
            "link": "",
            "linkText": ""
          },
          {
            "type": "Bản tham khảo đã hoàn thiện",
            "link": "",
            "linkText": ""
          },
          {
            "type": "File Excel đăng ký trường",
            "link": "",
            "linkText": ""
          }
        ]
      }
    ]
  },
  "tem": {
    "name": "Thông tin làm tem các trường",
    "schools": [
      {
        "name": "THÔNG TIN CÁC TRƯỜNG CAO ĐẲNG ĐẠI HỌC TẠI VIỆT NAM",
        "address": "Đường 7 , Diễn Thành, Diễn Châu, Nghệ An",
        "phone": "023.8893.4242",
        "email": "info@cdhn.edu.vn"
      },
      {
        "name": "TRƯỜNG CAO ĐẲNG KỸ THUẬT CÔNG NGHIỆP",
        "address": "Số 202 đường Trần Nguyên Hãn, phường Bắc Giang, tỉnh Bắc Ninh",
        "phone": "(0240) 3826112",
        "email": "contact@bcit.edu.vn"
      }
    ]
  },
  "danhSach": {
    "name": "Danh sách trường Hàn",
    "rows": [
      {
        "name": "Dong-Eui",
        "nameKr": "동의대학교",
        "system": "D2-6 > D2-2 (Đại học)",
        "quota": 200,
        "mou": "VTV, HCCT, BCIT",
        "catalog": "https://drive.google.com/file/d/1MQbj-xk9pruCY02PzuJrf_WbIG_5g9rw/view?usp=drive_link"
      },
      {
        "name": "YeonSung",
        "nameKr": "연성대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HPC, HCCT, SGT, BCIT, VTV, TVU",
        "catalog": "https://drive.google.com/file/d/1zxrl8VWiFVYxpP26OemGroLqYgo_Dh1j/view?usp=sharing"
      },
      {
        "name": "JANGAN -",
        "nameKr": "장안대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng )",
        "quota": 200,
        "mou": "",
        "catalog": "https://drive.google.com/file/d/1jsfqYFqutBEEYEvj1SQencT5CXrl739u/view?usp=sharing"
      },
      {
        "name": "Induk",
        "nameKr": "인덕대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 100,
        "mou": "HNC, VTV, TVU, SGT, BCIT",
        "catalog": "https://drive.google.com/file/d/1_bc1jra3dZGwxyewx7WIVu3npbA-RGRJ/view?usp=sharing"
      },
      {
        "name": "Osan",
        "nameKr": "오산대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 100,
        "mou": "HNC, HPC, SGT",
        "catalog": "https://drive.google.com/file/d/14ClpFkKAHstGFOanMnvrial_ymNzoINW/view?usp=sharing"
      },
      {
        "name": "Suncheon Jeil",
        "nameKr": "순천제일",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, VTV, TVU, SGT, BCIT, HPC",
        "catalog": "https://drive.google.com/file/d/1jeLs-moW3bI0St6UxQTlPPxPvaHPWJ_b/view?usp=sharing"
      },
      {
        "name": "Dongnam",
        "nameKr": "동남보건대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "HNC, HPC, HCCT, SGT, BCIT",
        "catalog": "https://drive.google.com/file/d/1vHfckqZeJd4u1uyE29S2lRpEaOBjcboa/view?usp=sharing"
      },
      {
        "name": "KyungGin -",
        "nameKr": "경인여자대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng )",
        "quota": 100,
        "mou": "",
        "catalog": "https://drive.google.com/file/d/13LjLRc-M2OLW1Hb6_jefzRMeLwDdl5LU/view?usp=sharing"
      },
      {
        "name": "AJOU MOTOR",
        "nameKr": "아주자동차대학",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 200,
        "mou": "TVU, BCIT",
        "catalog": "https://drive.google.com/file/d/11jo3OFyMIUoBd7hfQ0rpfEx5T8TFahib/view?usp=sharing"
      },
      {
        "name": "Daewon",
        "nameKr": "대원대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 100,
        "mou": "",
        "catalog": "https://drive.google.com/file/d/17MFnGZQOPPJZXYR-2XmrA-1NAzH0v13P/view?usp=sharing"
      },
      {
        "name": "Nữ Busan",
        "nameKr": "부산여자대학교",
        "system": "D2-6 > D2-1 (Cao Đẳng)",
        "quota": 100,
        "mou": "",
        "catalog": "https://drive.google.com/file/d/1kUaBnz51NrUtELKTHt-ZBhFvt7TYp62s/view?usp=sharing"
      }
    ]
  }
};
