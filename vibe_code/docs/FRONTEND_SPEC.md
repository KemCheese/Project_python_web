# ĐẶC TẢ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (FRONTEND & UX SPEC)

---

## 🎨 1. Triết Lý Thiết Kế (Design Philosophy — Anti-Slop & Design-Taste-Frontend)

Giao diện của **Vibe Code Guestbook** được nâng cấp toàn diện theo bộ tiêu chuẩn **Swiss / Neo-Editorial & Architectural Chronicle** (tuân thủ nguyên tắc Anti-Slop từ `/design-taste-frontend`):
* **Không lạm dụng AI Cliches:** Loại bỏ hoàn toàn dải màu tím gradient slop (`#6366f1` / `#a855f7` / `#ec4899`) và hiệu ứng quả cầu sáng mờ mịt mù (`ambient-glow blur-120px`). Thay vào đó là bảng màu Obsidian & Electric Cobalt sắc gọn, chuyên nghiệp.
* **Bố cục bất đối xứng có chủ đích (Anti-Center Bias):** Hero không căn giữa đơn điệu mà phân bổ 2 cột bất đối xứng (Trái: Nội dung & CTA, Phải: Spotlight thẻ lời nhắn mới nhất kèm Live Pulse).
* **Thích ứng co giãn mượt mà (Fluid Responsive Scaling):** Sử dụng các biến đo lường linh hoạt với hàm `clamp()` cho typography, khoảng đệm (`padding`, `gap`), tự động thích ứng hoàn hảo từ màn hình di động nhỏ (360px), iPad (768px), Laptop (1024px-1440px) tới màn hình rộng 2K / 4K / Ultrawide mà không bị vỡ bố cục hay lọt thỏm.
* **Tương tác vật lý xúc giác (Tactile Micro-interactions):** Nhấp nhả phím với hiệu ứng lún nhẹ (`translateY(1px) scale(0.99)`), copy nội dung nhanh với thông báo nổi (Toast Notification), hỗ trợ phím tắt `Ctrl + Enter` gửi form nhanh.

---

## 🌈 2. Hệ Thống Thiết Kế (Design System & Color Tokens)

Hệ thống biến CSS (CSS Variables) được định nghĩa tập trung tại `vibe_code/static/css/style.css`:

### 2.1. Bảng màu chủ đạo (Color Palette — Dark & Light Mode)
| Token Name | Chế độ Tối (Dark - Default) | Chế độ Sáng (Light) | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#090d15` (Obsidian Carbon) | `#f8fafc` (Gallery Paper) | Nền toàn trang, có họa tiết lưới kiến trúc thanh nhã |
| `--bg-surface` | `#0e1524` | `#ffffff` | Nền Header Navbar, Footer |
| `--bg-card` | `#111a2c` | `#ffffff` | Thẻ lời nhắn, Thẻ KPI, Form nhập liệu |
| `--border-hairline` | `rgba(255, 255, 255, 0.07)` | `#e2e8f0` | Đường kẻ mảnh phân chia bố cục |
| `--border-subtle` | `rgba(255, 255, 255, 0.12)` | `#cbd5e1` | Viền thẻ chuẩn có độ tương phản cao |
| `--text-primary` | `#f8fafc` | `#090d16` | Tiêu đề chính, văn bản có trọng số cao |
| `--text-secondary`| `#94a3b8` | `#475569` | Nội dung lời nhắn, diễn giải phụ |
| `--text-muted` | `#64748b` | `#64748b` | Dấu thời gian, ID badge, chỉ số kỹ thuật |
| `--accent` | `#2563eb` (Electric Cobalt) | `#2563eb` | Điểm nhấn chính thương hiệu, nút CTA, thanh tiến trình |
| `--danger` | `#ef4444` | `#dc2626` | Trạng thái cảnh báo, nút xóa lời nhắn |

### 2.2. Nghệ thuật chữ & Thang tỷ lệ linh hoạt (Fluid Typography & Clamp Tokens)
* **Font chữ chính:** `Plus Jakarta Sans` kết hợp `JetBrains Mono` cho nhãn mã số, thời gian và số liệu.
* **Thang kích cỡ chữ thích nghi (Adaptive Type Scale):**
  * `Display Hero`: `clamp(2.1rem, 1.4rem + 2.6vw, 3.6rem)`
  * `Heading 1`: `clamp(1.65rem, 1.25rem + 1.6vw, 2.45rem)`
  * `Heading 2`: `clamp(1.25rem, 1.05rem + 0.8vw, 1.65rem)`
  * `Heading 3`: `clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem)`
  * `Body Text`: `clamp(0.925rem, 0.88rem + 0.15vw, 1rem)`
  * `Small / Mono`: `0.8125rem` / `0.72rem`
* **Vùng bao chứa (Container Constraint):**
  * `--container-max: min(94vw, 1440px)` giúp giao diện mở rộng tự nhiên trên màn hình rộng mà không bị ép cứng ở 1200px hay bè ngang quá mức.

---

## 📑 3. Đặc Tả Chi Tiết Từng Giao Diện

### 3.1. Khung Giao Diện Gốc (`templates/base.html`)
* **Thanh điều hướng (Navbar):**
  * **Brand Monogram:** Huy hiệu vuông bo góc `GB` kèm tiêu đề kép `Guestbook` và `Live Chronicle`.
  * **Menu chính:**
    * 📜 `Sổ lưu bút` (Trang chủ `/`)
    * ✍️ `Viết lời nhắn` (Form `/add`)
    * 📊 `Báo cáo & Đồ thị` (Dashboard `/stats`)
  * **Nút chuyển đổi giao diện:** Nút bấm Sun/Moon mượt mà, lưu trạng thái vào `localStorage` kèm thông báo Toast phản hồi.
  * **Mobile Navigation Drawer:** Menu di động mở ra khi bấm biểu tượng hamburger trên màn hình cảm ứng (< 768px).
* **Chân trang (Footer):**
  * Thông tin kiến trúc hệ thống, kèm các huy hiệu công nghệ hiện đại.
* **Modal xác nhận toàn cục (`#deleteModal`):**
  * Hiệu ứng làm mờ nền (Backdrop Blur), hỗ trợ đóng bằng phím `Escape`, nhấp ngoài vùng modal hoặc nút "Hủy".

---

### 3.2. Trang Chủ Danh Sách Lời Nhắn (`templates/index.html`)

* **Hero Section Bất Đối Xứng:**
  * Cột trái: Nhãn trạng thái `LIVE COMMUNITY LEDGER` với chấm nhịp đập Pulse, tiêu đề chính, mô tả cô đọng, 2 nút hành động (Gửi lời nhắn mới / Xem đồ thị) và thanh thống kê trực tiếp (Tổng lời nhắn, Cập nhật thời gian thực, Cơ sở dữ liệu).
  * Cột phải: Thẻ spotlight hiển thị ngay thông điệp mới nhất được gửi trong hệ thống kèm tên tác giả và dấu thời gian.
* **Thanh công cụ Toolbar:**
  * Nhóm tiêu đề: "Lời Nhắn Đã Lưu" kèm huy hiệu đếm số lượng.
  * Bộ lọc sắp xếp: Tab "Mới nhất" và "Cũ nhất" với khả năng đảo chiều hiển thị ngay lập tức.
  * Ô tìm kiếm thời gian thực (Live Search): Tìm nhanh theo tên hoặc nội dung, có nút `✕` để xóa từ khóa tức thì.
* **Lưới Thẻ Lời Nhắn (Entries Grid):**
  * Co giãn dạng Bento / Grid đa cột thích ứng (`minmax(clamp(290px, 24vw, 380px), 1fr)`).
  * Mỗi thẻ có: Avatar tác giả với chữ cái đầu viết hoa, tên tác giả, nhãn thời gian, mã số `#ID`, nội dung tin nhắn, nút "Sao chép" và nút "Xóa".

---

### 3.3. Trang Thêm Lời Nhắn Mới (`templates/add.html`)

* **Bố cục:** Thẻ form kiến trúc với chiều rộng tối ưu `max-width: 620px` đặt giữa trang.
* **Trường dữ liệu:**
  1. **Họ và tên:** Input có icon đại diện, gợi ý rõ ràng và ràng buộc bắt buộc.
  2. **Nội dung thông điệp:** Textarea có bộ đếm ký tự thời gian thực (`0/500`) tự động chuyển màu cảnh báo khi gần đạt giới hạn.
  3. **Hỗ trợ phím tắt:** Tích hợp `Ctrl + Enter` (hoặc `Cmd + Enter`) để gửi tin nhắn nhanh chóng mà không cần di chuột.
* **Khối thông báo lỗi (Alert Box):** Hiển thị rõ ràng với độ tương phản chuẩn WCAG AA khi xảy ra lỗi nhập liệu.

---

### 3.4. Trang Báo Cáo Thống Kê & Phân Tích (`templates/stats.html`)

* **Bộ 3 Thẻ Chỉ Số KPI Bento Row:**
  * Tổng số lời nhắn đã ghi nhận.
  * Số lượng tác giả độc nhất ghé thăm.
  * Tác giả đóng góp tích cực nhất.
* **Phân tích đối sánh (Leaderboard vs Biểu đồ):**
  * Cột trái: Bảng vinh danh Top 5 người gửi nhiều nhất với huy hiệu thứ hạng 1, 2, 3 mạ màu Vàng, Bạc, Đồng, thanh tiến trình tỷ lệ phần trăm và số lượng lời nhắn.
  * Cột phải: Biểu đồ cột Matplotlib được xuất với độ nét cao 200 DPI (`static/stats.png`), sử dụng dải màu Cobalt & Slate đồng nhất với toàn bộ giao diện, loại bỏ hoàn toàn các dải màu tím AI rườm rà.

---

## ⚡ 4. Tương Tác Người Dùng (Micro-interactions & `main.js`)

1. **Bộ đệm thông báo nổi (Toast Shelf):** Phản hồi tức thì khi người dùng đổi theme, sao chép nội dung lời nhắn.
2. **Sao chép nội dung lời nhắn một chạm:** Sử dụng API `navigator.clipboard` giúp người dùng sao chép lời nhắn nhanh chóng.
3. **Tìm kiếm & Phân loại không tải lại trang:** Lọc mượt mà dựa trên thuộc tính `data-author` và `data-message`.
4. **Hiệu ứng xúc giác phản hồi vật lý:** Hover nổi nhẹ 2px, Click nén nhẹ 1px giúp tương tác chân thực và cao cấp.
