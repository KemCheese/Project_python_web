# BẢN ĐỒ TUYẾN ĐƯỜNG & ĐẶC TẢ ENDPOINTS (ROUTES MAP)

---

## 🗺️ 1. Bảng Tổng Hợp Tuyến Đường (Endpoints Map)

Hệ thống cung cấp 6 tuyến đường xử lý HTTP hoàn chỉnh cho toàn bộ vòng đời ứng dụng Sổ Lưu Bút:

| STT | Phương Thức | Tuyến Đường (Route) | Chức Năng Chính | Tham Số Đầu Vào | Kết Quả Phản Hồi (HTTP Response) |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/` | Hiển thị danh sách sổ lưu bút dạng card | Không | `200 OK` - Render `index.html` (kèm danh sách `entries`) |
| 2 | `GET` | `/board` | Không gian trực quan (Bảng lưu niệm hoài niệm tự do) | Không | `200 OK` - Render `board.html` (thẻ Polaroid & Washi tape) |
| 3 | `GET` | `/add` | Hiển thị form soạn lời nhắn | Không | `200 OK` - Render `add.html` |
| 4 | `POST` | `/add` | Xử lý thêm lời nhắn mới | `name`, `message` (Form Data) | `302 Found` - Redirect về `/` (thành công) hoặc `200 OK` render lại kèm `error` |
| 5 | `POST` / `GET` | `/delete/<int:id>` | Xóa một lời nhắn theo ID | `id` (Tham số URL kiểu `int`) | `302 Found` - Redirect về `/` |
| 6 | `GET` | `/stats` | Báo cáo thống kê & Bục đứng Olympic | Không | `200 OK` - Render `stats.html` (kèm ảnh `stats.png` 200 DPI và bục Olympic Top 3) |

---

## 🔍 2. Đặc Tả Chi Tiết Từng Tuyến Đường

### 2.1. Tuyến Đường `GET /` - Trang Chủ Danh Sách Lời Nhắn
* **Mục đích:** Đọc dữ liệu từ cơ sở lưu trữ và trình bày danh sách thông điệp cho người dùng.
* **Quy trình xử lý tại Backend:**
  1. Gọi hàm `load_entries()` để tải danh sách các lời nhắn từ `data.json`.
  2. Áp dụng sắp xếp theo thứ tự giảm dần của `id` (`sorted(entries, key=lambda x: x.get('id', 0), reverse=True)`), đảm bảo lời nhắn gửi gần nhất luôn đứng đầu danh sách.
  3. Hỗ trợ lọc cũ nhất/mới nhất và tìm kiếm tức thì client-side mà không cần tải lại trang.
  4. Truyền biến `entries` vào template `index.html` để render giao diện dạng thẻ Card.
* **Mã trạng thái HTTP:** `200 OK`.

---

### 2.2. Tuyến Đường `GET /board` - Không Gian Trực Quan (Visual Memory Board)
* **Mục đích:** Trình chiếu các kỷ niệm dưới dạng bảng ghi chú tự do hoài niệm (Polaroid & Giấy ghi chú dán băng keo washi) không bị gò bó bởi khung hộp máy móc.
* **Quy trình xử lý tại Backend:**
  1. Tải danh sách các lời nhắn qua `load_entries()`.
  2. Truyền `entries` sang `board.html`.
  3. Template tự động gán các hiệu ứng xoay góc ngẫu hứng (`tilt-0` đến `tilt-6`), bảng màu hoài niệm (Warm Ivory, Pastel Peach, Sage Mint, Sky Linen, Butter Cream, Lavender Mist) và băng keo Washi thủ công.
  4. Hỗ trợ modal phóng to tập trung chi tiết (Focus Mode Overlay) với chuyển động mượt mà bay từ vị trí thẻ ra trung tâm màn hình.
* **Mã trạng thái HTTP:** `200 OK`.

---

### 2.3. Tuyến Đường `GET /add` - Mở Form Viết Lời Nhắn
* **Mục đích:** Trả về giao diện form để khách ghé thăm nhập họ tên và thông điệp.
* **Quy trình xử lý tại Backend:**
  1. Render trực tiếp template `add.html` với trạng thái form ban đầu rỗng.
* **Mã trạng thái HTTP:** `200 OK`.

---

### 2.4. Tuyến Đường `POST /add` - Tiếp Nhận & Lưu Trữ Lời Nhắn
* **Mục đích:** Xác thực dữ liệu gửi lên từ form, sinh mã định danh và lưu trữ bền vững.
* **Dữ liệu tiếp nhận (Form Body):**
  * `name`: Chuỗi văn bản tên người gửi.
  * `message`: Chuỗi văn bản nội dung thông điệp.
* **Quy tắc xác thực (Validation Rules):**
  ```python
  name = request.form.get('name', '').strip()
  message = request.form.get('message', '').strip()

  # Ràng buộc: Cả hai trường đều không được phép để trống
  if not name or not message:
      error = "Vui lòng nhập đầy đủ cả tên và nội dung lời nhắn (không được để trống)!"
      return render_template('add.html', error=error, name=name, message=message)
  ```
* **Khi dữ liệu hợp lệ:**
  1. Tải danh sách hiện tại qua `load_entries()`.
  2. Tính toán ID mới: `new_id = max([e.get('id', 0) for e in entries], default=0) + 1`.
  3. Đóng dấu thời gian hiện tại: `created_at = datetime.now().strftime('%Y-%m-%d %H:%M')`.
  4. Đóng gói đối tượng dict mới và thêm vào danh sách.
  5. Ghi đồng bộ xuống file bằng `save_entries(entries)`.
  6. Thực hiện chuyển hướng trình duyệt: `redirect(url_for('index'))` với mã `302 Found`.

---

### 2.5. Tuyến Đường `/delete/<int:id>` - Xóa Lời Nhắn Theo ID
* **Mục đích:** Xóa bỏ lời nhắn được chỉ định khỏi cơ sở lưu trữ.
* **Phương thức hỗ trợ:** Cả `POST` và `GET` (được bảo vệ bởi Modal xác nhận giao diện người dùng).
* **Tham số đường dẫn:** `id` là số nguyên định danh của lời nhắn.
* **Quy trình xử lý tại Backend:**
  1. Tải danh sách hiện tại: `entries = load_entries()`.
  2. Tạo danh sách mới loại trừ phần tử có ID tương ứng.
  3. Kiểm tra: Nếu kích thước danh sách có sự thay đổi, tiến hành ghi lại dữ liệu bằng `save_entries(updated_entries)`.
  4. Chuyển hướng người dùng về trang chủ: `redirect(url_for('index'))`.
* **Mã trạng thái HTTP:** `302 Found`.

---

### 2.6. Tuyến Đường `GET /stats` - Trung Tâm Phân Tích & Bục Đứng Olympic
* **Mục đích:** Tổng hợp các chỉ số định lượng, tạo biểu đồ cột phân tích trực quan 200 DPI và hiển thị Bục đứng vinh danh Olympic Top 3.
* **Quy trình xử lý tại Backend:**
  1. **Tính tổng số lời nhắn:** `total_entries = len(entries)`.
  2. **Thống kê tần suất tác giả chuẩn hóa khoảng trắng:**
     ```python
     clean_names = [' '.join(e.get('name', '').split()) for e in entries if e.get('name', '').strip()]
     sender_counts = Counter(clean_names)
     top_senders = sender_counts.most_common(5) # Top 5 tác giả cho biểu đồ
     unique_authors = len(sender_counts)        # Số lượng tác giả độc nhất
     top_contributor = top_senders[0][0] if top_senders else "Chưa có"
     avg_per_author = round(total_entries / unique_authors, 1) if unique_authors > 0 else 0
     ```
  3. **Khởi tạo và xuất biểu đồ Matplotlib (`generate_stats_chart`):**
     * Thiết lập chế độ vẽ không giao diện màn hình `matplotlib.use('Agg')`.
     * Xuất file hình ảnh 200 DPI với bảng màu Vibrant Gradient tương thích hoàn hảo Light & Dark mode.
     * Lưu file hình ảnh vào `static/stats.png`.
     * Thu hồi tài nguyên đồ họa với `plt.close(fig)`.
  4. **Render giao diện:**
     * Trả về template `stats.html` kèm các biến chỉ số: `total_entries`, `unique_authors`, `top_contributor`, `top_senders`, `avg_per_author`.
     * Bảng Vinh Danh hiển thị **Bục Đứng Olympic Top 3** tinh giản:
       - Hạng 2 (Bạc) bên trái (cao vừa)
       - Hạng 1 (Vàng) ở giữa (cao nhất, vương miện sao, avatar vàng)
       - Hạng 3 (Đồng) bên phải (thấp nhất)
       - Số thứ hạng to rõ `2`, `1`, `3` căn giữa, không có chữ rườm rà.
* **Mã trạng thái HTTP:** `200 OK`.

---

## 🚦 3. Sơ Đồ Điều Hướng Xử Lý Yêu Cầu (Routing Decision Flowchart)

```mermaid
flowchart TD
    Req([Yêu Cầu Từ Client]) --> URLCheck{URL Tuyến Đường?}
    
    URLCheck -->|GET /| RouteIndex["Hàm index()<br/>1. Đọc data.json<br/>2. Sort ID giảm dần<br/>3. Render index.html"]
    
    URLCheck -->|GET /board| RouteBoard["Hàm board()<br/>1. Đọc data.json<br/>2. Render board.html (Polaroid Canvas)"]
    
    URLCheck -->|GET /add| RouteAddGet["Hàm add()<br/>Render add.html"]
    
    URLCheck -->|POST /add| RouteAddPost{"Validate Name & Message"}
    RouteAddPost -->|Trống| AddFail["Render lại add.html<br/>kèm thông báo error"]
    RouteAddPost -->|Hợp lệ| AddSuccess["1. Sinh new_id<br/>2. Đóng dấu thời gian<br/>3. Ghi file data.json<br/>4. Redirect /"]
    
    URLCheck -->|GET/POST /delete/id| RouteDelete["Hàm delete(id)<br/>1. Lọc bỏ id trong list<br/>2. Ghi file data.json<br/>3. Redirect /"]
    
    URLCheck -->|GET /stats| RouteStats["Hàm stats()<br/>1. Đếm len(entries)<br/>2. Counter Top tác giả<br/>3. Matplotlib sinh stats.png 200 DPI<br/>4. Render stats.html (Bục Olympic Top 3)"]
    
    RouteIndex --> Res200([200 OK Response])
    RouteBoard --> Res200
    RouteAddGet --> Res200
    AddFail --> Res200
    RouteStats --> Res200
    AddSuccess --> Res302([302 Redirect to /])
    RouteDelete --> Res302
```

