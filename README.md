# Dự Án Web Guestbook Python (Bài Tập Nhóm)


## 📌 Tổng Quan
Dự án ứng dụng Web Sổ Lưu Bút phát triển trên nền tảng **Python Flask** và **Jinja2 Templates**, với cơ sở dữ liệu bền vững qua file **`data.json`** và đồ thị phân tích tạo bởi **Matplotlib**.

Dự án được triển khai đầy đủ với **2 phiên bản**:

---

### 📘 1. Phiên Bản Manual Code (`manual_code/`)
Phiên bản viết mã thủ công, cấu trúc tinh gọn, trong sáng và bám sát chính xác các yêu cầu cơ bản của đề bài:
* **Cơ sở dữ liệu:** Lưu trữ trực tiếp vào tệp `data.json` (tự nạp khi khởi động, ghi khi thêm/xóa).
* **Biểu đồ cột:** Tự động vẽ và cập nhật biểu đồ Top người gửi bằng Matplotlib tại `/stats`.
* **Mã nguồn:** [manual_code/](file:///d:/lam%20viec/FORK/Project_python_web/manual_code)
* **Tài liệu chi tiết & Hướng dẫn chạy:** [manual_code/README.md](file:///d:/lam%20viec/FORK/Project_python_web/manual_code/README.md)

**Cách khởi chạy:**
```bash
cd manual_code
python app.py
```
Truy cập: `http://127.0.0.1:5000`

---

### 🌟 2. Phiên Bản Vibe Code (`vibe_code/`)
Ứng dụng hoàn thiện cao cấp với thiết kế hiện đại, giao diện trực quan, trung tâm phân tích số liệu kèm biểu đồ cột Matplotlib và bộ tài liệu kiến trúc chuyên sâu:
* **Mã nguồn ứng dụng:** [vibe_code/](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code)
* **Tài liệu hướng dẫn & Onboarding:** [vibe_code/docs/ONBOARDING.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/ONBOARDING.md)
* **Kiến trúc hệ thống (MVC):** [vibe_code/docs/ARCHITECTURE.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/ARCHITECTURE.md)
* **Mô hình dữ liệu & Lưu trữ:** [vibe_code/docs/DATA_MODEL.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/DATA_MODEL.md)
* **Đặc tả giao diện & UX:** [vibe_code/docs/FRONTEND_SPEC.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/FRONTEND_SPEC.md)
* **Bản đồ tuyến đường (Routes):** [vibe_code/docs/ROUTES_MAP.md](file:///d:/lam%20viec/FORK/Project_python_web/vibe_code/docs/ROUTES_MAP.md)

**Cách khởi chạy:**
```bash
cd vibe_code
python app.py
```
Truy cập: `http://127.0.0.1:5000`

---

## ⚙️ Cài Đặt Chung
Cài đặt các thư viện cần thiết cho cả 2 phiên bản:
```bash
pip install -r requirements.txt
```
