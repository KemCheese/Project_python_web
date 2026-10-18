# HỆ THỐNG TÀI LIỆU DỰ ÁN VIBE CODE GUESTBOOK

> **Dự án:** Sổ Lưu Bút Trực Tuyến Hiện Đại (Vibe Code Guestbook)  
> **Ngôn ngữ & Nền tảng:** Python 3.10+ | Flask Micro-framework  

---

## 📌 1. Giới Thiệu Tổng Quan

**Vibe Code Guestbook** là ứng dụng web sổ lưu bút hoàn chỉnh, được phát triển với tiêu chuẩn chất lượng cao về kiến trúc backend lẫn thẩm mỹ giao diện frontend. Ứng dụng cung cấp giải pháp ghi nhận, quản lý và phân tích trực quan các thông điệp từ khách ghé thăm với những điểm nổi bật:

* 💬 **Trải nghiệm lưu bút mượt mà:** Khách có thể đọc các lời nhắn hiển thị theo dạng thẻ trực quan (Card layout), thêm lời nhắn mới với cơ chế xác thực dữ liệu ngay tại giao diện.
* 🖼️ **Không gian trực quan (Visual Board):** Bảng ghi nhớ hoài niệm tự do (`/board`) với các bức ảnh Polaroid và băng keo Washi thủ công, hỗ trợ Focus Mode phóng to mượt mà ra giữa màn hình.
* 🛡️ **Quản lý an toàn & Thân thiện:** Thao tác xóa lời nhắn được bảo vệ bằng hộp thoại xác nhận (Modal) phong cách Glassmorphism, tránh xóa nhầm dữ liệu.
* 📊 **Trung tâm phân tích & Bục Olympic:** Trang Dashboard thống kê tự động tổng hợp số liệu, vẽ biểu đồ cột trực quan 200 DPI bằng **Matplotlib** và vinh danh tác giả trên **Bục Đứng Olympic Top 3** chuẩn quốc tế.
* 💾 **Lưu trữ dữ liệu bền vững (Persistent Storage):** Toàn bộ dữ liệu được lưu trữ an toàn trong file JSON có cấu trúc (`data.json`), tự động nạp khi ứng dụng khởi chạy và đồng bộ ngay lập tức sau mỗi thao tác thêm/xóa.

---

## 📂 2. Cấu Trúc Thư Mục Vibe Code

Mã nguồn và tài liệu của phiên bản **Vibe Code** được tổ chức khoa học, tách bạch rõ ràng giữa xử lý logic, tầng dữ liệu, giao diện và tài liệu thiết kế:

```
vibe_code/
├── app.py                      # Ứng dụng Flask trung tâm (Routes, Controller & Matplotlib Chart Service)
├── data.json                   # Cơ sở dữ liệu JSON lưu trữ bền vững các lời nhắn
├── requirements.txt            # Danh sách gói phụ thuộc (Flask, Matplotlib)
│
├── docs/                       # Bộ tài liệu đặc tả kỹ thuật toàn diện
│   ├── ONBOARDING.md           # Hướng dẫn nhập môn, cài đặt & tổng quan hệ thống (File này)
│   ├── ARCHITECTURE.md         # Kiến trúc hệ thống MVC, luồng xử lý dữ liệu & sơ đồ tuần tự
│   ├── DATA_MODEL.md           # Đặc tả mô hình dữ liệu, cơ chế lưu trữ JSON & tư vấn MySQL
│   ├── FRONTEND_SPEC.md        # Đặc tả giao diện, Design System Tokens, CSS & Micro-interactions
│   ├── ROUTES_MAP.md           # Bản đồ chi tiết các Routes, Endpoints, Tham số & Phản hồi
│   └── adr/                    # Các bản ghi quyết định kiến trúc then chốt (ADR)
│       ├── README.md           # Mục lục danh sách quyết định
│       ├── ADR-0001-chon-flask-lam-web-framework.md
│       ├── ADR-0002-kien-truc-giao-dien-design-system.md
│       ├── ADR-0002-zero-flash-light-mode-and-youthful-design.md
│       └── ADR-0003-chien-luoc-luu-tru-du-lieu-va-tu-van-mysql.md
│
├── static/                     # Tài nguyên tĩnh của ứng dụng
│   ├── css/
│   │   └── style.css           # Design System hiện đại (Tokens, Glassmorphism, Theme, Animation)
│   ├── js/
│   │   └── main.js             # Xử lý tương tác Frontend (Modal xác nhận xóa, Micro-interactions)
│   └── stats.png               # File ảnh biểu đồ thống kê tự động sinh bởi Matplotlib
│
└── templates/                  # Hệ thống giao diện Jinja2 Templates kế thừa
    ├── base.html               # Layout gốc chứa Header, Navigation, Footer & Modal toàn cục
    ├── index.html              # Trang chủ hiển thị danh sách lời nhắn dạng Card
    ├── board.html              # Bảng ghi nhớ hoài niệm tự do (Polaroid & Focus Mode)
    ├── add.html                # Form nhập lời nhắn mới với cơ chế báo lỗi trực quan
    └── stats.html              # Dashboard báo cáo thống kê & Bục đứng Olympic Top 3
```

---

## 🚀 3. Hướng Dẫn Cài Đặt & Khởi Chạy Nhanh

### 3.1. Yêu cầu môi trường
* **Python 3.10+** đã được cài đặt trên hệ thống.
* Trình duyệt web hiện đại (Chrome, Edge, Firefox, Brave...).

### 3.2. Cài đặt môi trường ảo (Khuyến nghị)
Mở terminal tại thư mục gốc của dự án hoặc ngay trong thư mục `vibe_code`:

```powershell
# Di chuyển vào thư mục vibe_code (nếu đang ở thư mục ngoài)
cd vibe_code

# Tạo môi trường ảo độc lập
python -m venv venv

# Kích hoạt môi trường ảo trên Windows PowerShell:
.\venv\Scripts\Activate.ps1
```

### 3.3. Cài đặt các thư viện cần thiết
```powershell
pip install -r ..\requirements.txt
# hoặc: pip install flask matplotlib
```

### 3.4. Khởi chạy ứng dụng
Chạy trực tiếp file `app.py`:
```powershell
python app.py
```

Sau khi khởi chạy thành công, console sẽ hiển thị thông báo:
```
Starting Vibe Code Guestbook at http://127.0.0.1:5000
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

Mở trình duyệt và truy cập: **[http://localhost:5000](http://localhost:5000)** hoặc **[http://127.0.0.1:5000](http://127.0.0.1:5000)**.

---

## 🧭 4. Bản Đồ Điều Hướng Tài Liệu

Tài liệu được chia thành các chuyên đề chuyên sâu, liên kết chặt chẽ với nhau:

| Tài Liệu | Nội Dung Trọng Tâm | Đường Dẫn |
| :--- | :--- | :--- |
| **Kiến Trúc Hệ Thống** | Mô hình MVC, sơ đồ tương tác thành phần, luồng xử lý 4 nghiệp vụ cốt lõi | [ARCHITECTURE.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/ARCHITECTURE.md) |
| **Mô Hình Dữ Liệu** | Định nghĩa thực thể Entry, cơ chế đọc/ghi JSON tự động, thiết kế mở rộng MySQL | [DATA_MODEL.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/DATA_MODEL.md) |
| **Đặc Tả Frontend** | Design Tokens, bảng màu HSL, hiệu ứng Glassmorphism, tương tác UI/UX | [FRONTEND_SPEC.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/FRONTEND_SPEC.md) |
| **Bản Đồ Tuyến Đường** | Bảng tổng hợp Endpoints, phương thức HTTP, tham số vào/ra, quy tắc validation | [ROUTES_MAP.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/ROUTES_MAP.md) |
| **Quyết Định Kiến Trúc** | Bản ghi các quyết định kỹ thuật then chốt (Flask, Design System, JSON vs MySQL) | [ADR Index](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/adr/README.md) |
