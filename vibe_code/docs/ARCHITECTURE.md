# KIẾN TRÚC HỆ THỐNG VIBE CODE GUESTBOOK (SYSTEM ARCHITECTURE)

---

## 🏗️ 1. Mô Hình Kiến Trúc Tổng Thể

Hệ thống **Vibe Code Guestbook** áp dụng kiến trúc **MVC (Model - View - Controller)** hướng module hóa, đảm bảo tính phân tách trách nhiệm (Separation of Concerns), dễ bảo trì và mở rộng:

```mermaid
graph TD
    User["👤 Người Dùng (Trình duyệt Web)"]
    
    subgraph Controller_Flask["Bộ Điều Khiển (Flask Application Controller)"]
        Routes["Routing Handler<br/>('/', '/board', '/add', '/delete/<id>', '/stats')"]
        Validation["Xác Thực Dữ Liệu Server-Side<br/>(Kiểm tra Name & Message hợp lệ)"]
        MatplotlibService["Dịch Vụ Phân Tích & Vẽ Biểu Đồ<br/>(Matplotlib Agg Engine - Vibrant Gradient 200 DPI)"]
    end
    
    subgraph Model_Persistence["Tầng Dữ Liệu Bền Vững (Persistence Layer)"]
        DataJSON[("📁 data.json<br/>Lưu trữ JSON bền vững (114+ entries)")]
        StorageOps["Bộ Thao Tác Dữ Liệu<br/>(load_entries / save_entries / auto_id)"]
    end

    subgraph View_Jinja2["Tầng Trình Diễn (Jinja2 Templates & Static Assets)"]
        BaseLayout["Layout Gốc: base.html<br/>(Navbar, Brand, Theme Toggle, Delete Modal, Footer)"]
        Templates["Các Giao Diện Con<br/>(index.html, board.html, add.html, stats.html)"]
        StaticAssets["Tài Nguyên Tĩnh Hiện Đại<br/>(style.css, main.js, stats.png)"]
    end

    User -->|Gửi yêu cầu HTTP| Routes
    Routes --> Validation
    Validation -->|Dữ liệu hợp lệ| StorageOps
    StorageOps <-->|Đọc / Ghi đồng bộ| DataJSON
    Routes -->|Kích hoạt vẽ biểu đồ| MatplotlibService
    MatplotlibService -->|Tạo & Xuất file ảnh 200 DPI| StaticAssets
    Routes -->|Truyền ViewModel| Templates
    Templates -.->|Kế thừa| BaseLayout
    BaseLayout -->|Render HTML Response hoàn chỉnh| User
```

---

## 🔄 2. Luồng Xử Lý Nghiệp Vụ Chi Tiết

### 2.1. Luồng Xem Danh Sách Lời Nhắn (`GET /`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Route as Flask Route (/)
    participant Storage as Storage Layer (load_entries)
    participant DB as data.json
    participant View as index.html (Jinja2)

    User->>Route: GET /
    Route->>Storage: Gọi load_entries()
    Storage->>DB: Đọc nội dung file JSON
    DB-->>Storage: Danh sách các entry dạng Dict
    Storage-->>Route: Trả về danh sách entries
    Route->>Route: Sắp xếp theo ID giảm dần (Tin mới nhất lên đầu)
    Route->>View: render_template('index.html', entries=sorted_entries)
    View-->>User: Hiển thị giao diện danh sách lời nhắn dạng Card
```

* **Xử lý:**
  1. Khi người dùng truy cập trang chủ, Flask kích hoạt hàm xử lý `index()`.
  2. Hệ thống đọc toàn bộ danh sách lời nhắn từ `data.json`.
  3. Sắp xếp danh sách theo ID giảm dần (`reverse=True`) để các lời nhắn mới nhất luôn hiển thị ở vị trí trên cùng.
  4. Nếu danh sách rỗng, giao diện hiển thị trạng thái Empty State trực quan kèm nút kêu gọi hành động để người dùng để lại lời nhắn đầu tiên.

---

### 2.2. Luồng Thêm Lời Nhắn Mới (`GET /add` & `POST /add`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách ghé thăm
    participant Route as Flask Route (/add)
    participant Storage as Storage Layer
    participant DB as data.json

    alt Bước 1: Mở form nhập liệu
        User->>Route: GET /add
        Route-->>User: Render trang add.html (Form nhập Name & Message)
    else Bước 2: Gửi dữ liệu form (POST)
        User->>Route: POST /add (name, message)
        Route->>Route: Cắt khoảng trắng dư thừa (.strip())
        
        alt Dữ liệu thiếu hoặc rỗng
            Route-->>User: Render lại add.html kèm thông báo lỗi trực quan & giữ nguyên nội dung đã nhập
        else Dữ liệu hợp lệ
            Route->>Storage: load_entries()
            Storage->>DB: Đọc dữ liệu hiện tại
            DB-->>Storage: entries list
            Route->>Route: Tự động tính new_id = max(id) + 1
            Route->>Route: Đóng dấu thời gian created_at (YYYY-MM-DD HH:MM)
            Route->>Storage: save_entries(entries)
            Storage->>DB: Ghi đè file data.json với định dạng indent chuẩn
            Route-->>User: Phản hồi 302 Redirect về trang chủ (/)
        end
    end
```

* **Cơ chế bảo vệ dữ liệu:**
  * **Validation Server-Side:** Không chỉ dựa vào thuộc tính `required` của HTML5, backend luôn kiểm tra `if not name or not message` để ngăn chặn các dữ liệu rỗng hoặc khoảng trắng vô nghĩa.
  * **Tự động sinh ID an toàn:** Hàm tính ID quét danh sách hiện tại để lấy giá trị lớn nhất cộng 1, đảm bảo tính duy nhất và không bị trùng lặp ngay cả khi các bản ghi trước đó đã bị xóa.

---

### 2.3. Luồng Xóa Lời Nhắn An Toàn (`POST` / `GET` `/delete/<int:id>`)

Để nâng cao trải nghiệm người dùng, phiên bản Vibe Code không sử dụng popup trình duyệt mặc định (`window.confirm`) mà tích hợp **Modal xác nhận phong cách Glassmorphism**:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người quản trị / Người dùng
    participant UI as Giao diện Web (main.js)
    participant Route as Flask Route (/delete/<id>)
    participant Storage as Storage Layer
    participant DB as data.json

    User->>UI: Bấm nút "Xóa" trên một Card lời nhắn
    UI->>UI: Hiển thị Modal xác nhận Glassmorphism kèm hiệu ứng Blur
    alt Người dùng bấm "Hủy bỏ"
        UI->>UI: Đóng Modal, giữ nguyên trạng thái
    else Người dùng bấm "Xác nhận xóa"
        UI->>Route: Gửi yêu cầu xóa tới /delete/<id>
        Route->>Storage: load_entries()
        Storage->>DB: Đọc danh sách entries
        Route->>Route: Lọc bỏ phần tử có id == target_id
        Route->>Storage: save_entries(updated_entries)
        Storage->>DB: Ghi lại dữ liệu mới vào data.json
        Route-->>User: 302 Redirect về trang chủ (/) với danh sách đã cập nhật
    end
```

---

### 2.4. Luồng Báo Cáo Thống Kê & Bục Đứng Olympic (`GET /stats`)

Ứng dụng tích hợp dịch vụ vẽ đồ thị động Matplotlib chạy ở chế độ nền (headless mode) cùng Bục đứng vinh danh Olympic Top 3:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người xem báo cáo
    participant Route as Flask Route (/stats)
    participant Storage as Storage Layer (load_entries)
    participant PlotService as Matplotlib Chart Service
    participant StaticFS as Thư mục static/ (stats.png)
    participant View as stats.html

    User->>Route: GET /stats
    Route->>Storage: load_entries()
    Storage-->>Route: Danh sách toàn bộ entries (114+ lời nhắn)
    
    Route->>Route: Tính tổng số tin nhắn: len(entries)
    Route->>Route: Chuẩn hóa khoảng trắng & Đếm tần suất bằng Counter
    Route->>Route: Trích xuất Top 5 tác giả cho biểu đồ & Top 3 cho Bục Olympic
    Route->>Route: Tính số tác giả độc nhất & Mật độ tương tác trung bình
    
    Route->>PlotService: generate_stats_chart(top_senders)
    PlotService->>PlotService: Khởi tạo figure tỉ lệ 16:9 với dpi=200
    PlotService->>PlotService: Áp dụng bảng màu Vibrant Gradient (Cyan, Violet, Rose, Mint, Amber)
    PlotService->>PlotService: Tùy biến nhãn trục, lưới ngang mờ, annotate số lượng
    PlotService->>StaticFS: Lưu file ảnh chất lượng cao vào static/stats.png
    PlotService->>PlotService: Giải phóng bộ nhớ đồ họa (plt.close(fig))
    
    Route->>View: render_template('stats.html', metrics, chart_url)
    View-->>User: Hiển thị 4 thẻ Bento KPI + Khung biểu đồ 200 DPI + Bục Đứng Olympic Top 3 (2 - 1 - 3)
```

---

### 2.5. Luồng Không Gian Trực Quan & Focus Mode (`GET /board`)

Không gian bảng ghi nhớ tự do hoài niệm đưa người dùng vào trải nghiệm lưu giữ ký ức cảm xúc:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Route as Flask Route (/board)
    participant Storage as Storage Layer (load_entries)
    participant View as board.html
    participant JS as main.js (Focus Modal Controller)

    User->>Route: GET /board
    Route->>Storage: load_entries()
    Storage-->>Route: Danh sách entries
    Route->>View: render_template('board.html', entries=entries)
    View-->>User: Hiển thị Canvas thẻ Polaroid tự do (ngẫu hứng xoay góc & dán băng washi)
    
    opt Người dùng bấm chọn 1 thẻ ghi chú bất kỳ
        User->>JS: Bấm click hoặc phím Enter trên thẻ
        JS->>JS: Tính toán tọa độ thẻ nguồn (BoundingRect)
        JS->>JS: Mở Focus Modal với animation scale-up mượt mà ra giữa màn hình
        User->>JS: Bấm Esc hoặc nút Đóng
        JS->>JS: Thu hồi Modal mượt mà trở lại vị trí gốc
    end
```

---

## 🛡️ 3. Cơ Chế Ổn Định & Khả Năng Chịu Lỗi (Resilience)

1. **Khởi tạo dữ liệu tự thích ứng (Self-Healing Storage):**
   * Nếu file `data.json` chưa từng tồn tại, hàm `load_entries()` trả về danh sách rỗng `[]` mà không gây lỗi crash.
   * Ngay khi có lời nhắn đầu tiên được thêm, hệ thống sẽ tự động tạo mới file `data.json` với cấu trúc JSON chuẩn hóa.
2. **Quản lý tài nguyên đồ họa (No Memory Leak):**
   * Matplotlib được cấu hình sử dụng backend `matplotlib.use('Agg')` ngay từ đầu, cho phép chạy hoàn hảo trên môi trường server không có giao diện đồ họa (headless).
   * Lệnh `plt.close(fig)` được gọi lập tức sau mỗi lần xuất file `stats.png`, giải phóng 100% tài nguyên bộ nhớ đệm đồ họa.
3. **An toàn Encoding ký tự:**
   * Thao tác đọc/ghi file luôn kích hoạt `encoding='utf-8'` và `ensure_ascii=False`, bảo toàn trọn vẹn dấu tiếng Việt và các biểu tượng cảm xúc (Emoji).
