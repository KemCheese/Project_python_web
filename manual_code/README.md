# Sổ Lưu Bút Python (Guestbook) - Bản Manual Code

Ứng dụng web Sổ Lưu Bút đơn giản, chuẩn mực và dễ hiểu, được xây dựng bằng **Python Flask**, sử dụng tệp **`data.json`** làm cơ sở dữ liệu lưu trữ và thư viện **Matplotlib** để trực quan hóa dữ liệu thống kê.

---

## 📁 Cấu Trúc Thư Mục

```text
manual_code/
│
├── app.py                # File mã nguồn chính chứa toàn bộ routing và xử lý logic
├── data.json             # Cơ sở dữ liệu JSON lưu trữ các lời nhắn
├── README.md             # Hướng dẫn chi tiết cách cài đặt, sử dụng và cấu trúc code
│
├── templates/            # Giao diện HTML (Jinja2 Templates)
│   ├── base.html         # Giao diện khung dùng chung (Header, Navbar, Footer)
│   ├── index.html        # Trang chủ: hiển thị danh sách tất cả lời nhắn & nút xóa
│   ├── add.html          # Trang biểu mẫu nhập lời nhắn mới (hỗ trợ báo lỗi khi để trống)
│   └── stats.html        # Trang thống kê: tổng số lời nhắn, top 5 người gửi & biểu đồ
│
└── static/               # Tệp tĩnh (CSS và hình ảnh biểu đồ)
    ├── style.css         # Bảng định kiểu CSS thuần, rõ ràng, sáng sủa và dễ bảo trì
    └── stats.png         # Biểu đồ cột Matplotlib được tự động tạo và cập nhật khi vào /stats
```

---

## 🚀 Tính Năng & Danh Sách Tuyến Đường (Routes)

Toàn bộ ứng dụng là một hệ thống hoàn chỉnh với 4 tuyến đường chính:

| Tuyến Đường (Route) | Phương Thức | Chức Năng Chính | Mô Tả Chi Tiết |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | **Trang chủ - Danh sách lời nhắn** | Đọc dữ liệu từ `data.json`, hiển thị bảng danh sách lời nhắn với các thông tin: ID, Tên người gửi, Nội dung, Thời gian gửi và nút Xóa. |
| `/add` | `GET`, `POST` | **Gửi lời nhắn mới** | • `GET`: Hiển thị form gồm 2 ô nhập: `name` (tên người gửi) và `message` (nội dung).<br>• `POST`: Kiểm tra dữ liệu. Nếu để trống bất kỳ trường nào, báo lỗi cụ thể; nếu hợp lệ, tự động cấp ID mới, lưu vào `data.json` và chuyển hướng về `/`. |
| `/delete/<int:id>` | `GET`, `POST` | **Xóa lời nhắn theo ID** | Tìm và xóa lời nhắn có ID tương ứng khỏi `data.json`, sau đó chuyển hướng về trang chủ `/`. |
| `/stats` | `GET` | **Thống kê & Biểu đồ** | • Đếm tổng số lời nhắn đã ghi.<br>• Thống kê Top 5 người gửi nhiều lời nhắn nhất.<br>• Tự động vẽ biểu đồ cột bằng **Matplotlib**, lưu thành file ảnh `static/stats.png` và nhúng trực tiếp vào trang web. |

---

## 💾 Cơ Chế Lưu Trữ Dữ Liệu (`data.json`)

Dữ liệu được lưu trữ bền vững trong tệp `data.json` dưới dạng một danh sách (list) các đối tượng JSON:

```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "message": "Xin chào! Ứng dụng Guestbook rất hay và hữu ích.",
    "created_at": "14/10/2026 09:30"
  }
]
```

- **Khi ứng dụng khởi động:** Hàm `load_entries()` sẽ đọc dữ liệu từ `data.json`. Nếu tệp chưa tồn tại, hàm sẽ trả về danh sách rỗng an toàn.
- **Khi thêm hoặc xóa lời nhắn:** Hàm `save_entries(entries)` sẽ ghi đè danh sách mới vào `data.json` với định dạng UTF-8, đảm bảo dữ liệu không bị mất khi khởi động lại chương trình.

---

## 📊 Cơ Chế Biểu Đồ Matplotlib

- Ứng dụng sử dụng backend `matplotlib.use('Agg')` để tạo biểu đồ mà không phụ thuộc vào màn hình đồ họa (GUI desktop).
- Hàm `generate_chart(top_senders)` đếm tần suất gửi của từng người gửi, sắp xếp top 5 và vẽ biểu đồ cột thể hiện trực quan.
- File ảnh biểu đồ được ghi vào `static/stats.png` và hiển thị trên giao diện `stats.html`. Đường dẫn ảnh được gắn kèm tham số chống cache (`?t=timestamp`) để luôn cập nhật dữ liệu mới nhất.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Chuẩn bị môi trường
Yêu cầu máy tính đã cài đặt **Python 3.8+**.

Mở terminal/command prompt tại thư mục gốc của dự án và cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```
*(Dự án chỉ yêu cầu `Flask` và `matplotlib`)*

### 2. Khởi chạy ứng dụng
Di chuyển vào thư mục `manual_code` và chạy:
```bash
cd manual_code
python app.py
```

### 3. Truy cập ứng dụng
Mở trình duyệt web bất kỳ và truy cập vào địa chỉ:
```
http://127.0.0.1:5000
```

---

## 🧪 Các Bước Thử Nghiệm Nhanh

1. **Xem danh sách lời nhắn:** Truy cập `http://127.0.0.1:5000/` để thấy danh sách mẫu có sẵn.
2. **Thêm lời nhắn mới:**
   - Nhấn nút **"+ Thêm Lời Nhắn Mới"** hoặc vào `http://127.0.0.1:5000/add`.
   - Thử bấm "Gửi Lời Nhắn" khi chưa điền để kiểm tra thông báo lỗi.
   - Nhập tên và lời nhắn hợp lệ, nhấn gửi để thấy lời nhắn mới xuất hiện ngay trên trang chủ.
3. **Xóa lời nhắn:**
   - Tại trang chủ, nhấn nút **"Xóa"** tại một lời nhắn bất kỳ. Trình duyệt sẽ hiển thị hộp thoại xác nhận, sau khi bấm OK lời nhắn sẽ bị xóa và tệp `data.json` được cập nhật.
4. **Xem thống kê và biểu đồ:**
   - Nhấn vào liên kết **"📊 Thống Kê & Đồ Thị"** trên thanh menu hoặc vào `http://127.0.0.1:5000/stats`.
   - Xem tổng số lời nhắn, bảng Top 5 người gửi và hình ảnh biểu đồ cột được tạo tự động.
