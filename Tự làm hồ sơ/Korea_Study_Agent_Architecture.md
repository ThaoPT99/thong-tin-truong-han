# Korea Study Agent

## AI Agent tư vấn và xử lý hồ sơ du học Hàn Quốc

### Mục tiêu

-   Phân tích hồ sơ học sinh
-   Đánh giá rủi ro
-   Gợi ý trường
-   Kiểm tra điều kiện visa
-   Sinh checklist hồ sơ
-   Sinh mẫu giải trình
-   Học từ kinh nghiệm của chuyên viên

## Triết lý

-   AI chỉ là bộ não.
-   Dữ liệu mới là tài sản.
-   Lợi thế cạnh tranh nằm ở Knowledge Base, Rule Engine và Case
    Database.

## Kiến trúc

``` text
Người dùng
    │
    ▼
Orchestrator Agent
    │
 ├── School Agent
 ├── Visa Agent
 ├── Document Agent
 └── Statement Agent
         │
         ▼
 Knowledge Base (RAG)
         │
 ├── Case Database
 ├── Rule Engine
 ├── School Database
 └── Lessons Learned
```

## Các thành phần

### Knowledge Base

Lưu tri thức, kinh nghiệm, quy định, chính sách và bài học thực tế.

### Rule Engine

Các quy tắc quyết định AI cần làm gì dựa trên đặc điểm hồ sơ.

### Case Database

Mỗi hồ sơ được lưu theo cấu trúc: - Đặc điểm - Vấn đề - Giải pháp - Kết
quả - Lesson Learned

## Các Agent

### Orchestrator Agent

Điều phối các Agent còn lại.

### School Agent

Đề xuất trường phù hợp.

### Visa Agent

Đánh giá rủi ro visa.

### Document Agent

Kiểm tra hồ sơ và sinh checklist.

### Statement Agent

Soạn và đánh giá Study Plan, Personal Statement, Gap Year Explanation.

### Interview Agent

Mô phỏng phỏng vấn lãnh sự.

## Roadmap

### Phase 1

-   Knowledge Base
-   Rule Engine
-   Checklist

### Phase 2

-   AI Assistant

### Phase 3

-   Multi-Agent System

### Phase 4

-   Learning Agent tự học từ case (có chuyên viên xác nhận).

## Tầm nhìn

Không xây chatbot.

Xây một AI Operating System dành cho ngành du học Hàn Quốc, trong đó mỗi
hồ sơ xử lý sẽ làm giàu thêm kho tri thức và nâng cao chất lượng tư vấn.
