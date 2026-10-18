# ĐẶC TẢ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (FRONTEND & UX SPEC)

---

## 🎨 1. Triết Lý Thiết Kế (Design Philosophy — Anti-Slop & Youthful Aesthetic)

Giao diện của **Góc Lưu Trữ (Vibe Code Guestbook)** được phát triển theo tiêu chuẩn thẩm mỹ cao cấp, lấy cảm hứng từ sự giao thoa giữa **Kỷ Niệm Hoài Niệm (Nostalgic Memory)** và **Công Nghệ Trẻ Trung (Youthful Vibrant Aesthetic)**, tuân thủ nghiêm ngặt nguyên tắc Anti-Slop từ `/design-taste-frontend`:

* **Tinh Tế & Chân Thật:** Loại bỏ hoàn toàn các khẩu hiệu AI sáo rỗng, các dải gradient tím nhạt mờ mịt gây chìm chữ, các thanh ticker trạng thái rườm rà và các huy hiệu trang trí thừa thãi.
* **Tự Do Trong Kỷ Niệm:** Trang Bảng Ghi Nhớ (`/board`) phá bỏ hoàn toàn các khung hộp cứng nhắc, để các bức ảnh Polaroid và mẩu giấy note viết tay tự do "treo" trên không gian với băng keo Washi thủ công.
* **Bục Đứng Olympic Vinh Quang:** Trang Thống Kê (`/stats`) thay thế danh sách xếp hạng phẳng đơn điệu bằng **Bục đứng vinh danh Olympic Top 3 (Olympic Podium Stand)** chuẩn quốc tế:
  - Bục 2 (Bạc) bên trái (cao vừa)
  - Bục 1 (Vàng) ở giữa (cao nhất, vương miện sao, avatar vàng)
  - Bục 3 (Đồng) bên phải (thấp nhất)
  - Số thứ hạng to rõ `2`, `1`, `3` căn giữa, không có chữ rườm rà hay pill % dư thừa.
* **Cơ Chế Chống FOUC Tuyệt Đối (Zero-Flash Light Mode):**
  - Khắc phục 100% lỗi nháy đen khi chuyển trang ở Light Mode.
  - Script nạp theme đồng bộ ngay đỉnh `<head>` trước khi nạp stylesheet.
  - Chỉ kích hoạt CSS Transition khi người dùng chủ động bấm đổi giao diện (`.theme-transitioning`), chuyển trang thông thường tức thì và mượt mà.

---

## 🌈 2. Hệ Thống Thiết Kế (Design System & Color Tokens)

Hệ thống biến CSS (CSS Variables) được định nghĩa tập trung tại `vibe_code/static/css/style.css`:

### 2.1. Bảng màu chủ đạo (Color Palette — Dark & Light Mode)
| Token Name | Chế độ Tối (Cosmic Slate) | Chế độ Sáng (Fresh Paper) | Ý Nghĩa Biểu Tượng |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#070a12` (Vũ trụ huyền bí) | `#f8fafc` (Giấy lưu bút tinh khôi) | Nền toàn trang, độ tương phản tuyệt đối |
| `--bg-surface` | `#0e1526` | `#ffffff` | Nền Header Navbar, Footer, Bề mặt nổi |
| `--bg-card` | `rgba(14, 21, 38, 0.82)` | `rgba(255, 255, 255, 0.92)` | Thẻ lời nhắn, Bento card, Bục Olympic |
| `--border-hairline`| `rgba(255, 255, 255, 0.1)` | `rgba(15, 23, 42, 0.08)` | Đường kẻ mảnh phân chia bố cục |
| `--border-subtle`  | `rgba(255, 255, 255, 0.16)` | `rgba(15, 23, 42, 0.14)` | Viền thẻ chuẩn có độ tương phản cao |
| `--text-primary`   | `#ffffff` | `#090d16` | Tiêu đề chính, văn bản có trọng số cao |
| `--text-secondary` | `#e2e8f0` | `#334155` | Nội dung lời nhắn, diễn giải phụ |
| `--text-muted`     | `#94a3b8` | `#64748b` | Dấu thời gian, ID badge, chỉ số kỹ thuật |
| `--grad-primary`   | `#38bdf8` → `#818cf8` → `#f472b6` | `#4f46e5` → `#7c3aed` → `#db2777` | Gradient thương hiệu trẻ trung, sắc nét |
| `--accent-gold`    | `#f59e0b` → `#fbbf24` | `#d97706` → `#f59e0b` | Bậc 1 Quán Quân, vương miện Olympic |
| `--accent-silver`  | `#94a3b8` → `#cbd5e1` | `#64748b` → `#94a3b8` | Bậc 2 Á Quân |
| `--accent-bronze`  | `#b45309` → `#d97706` | `#b45309` → `#d97706` | Bậc 3 Quý Quân |

### 2.2. Nghệ thuật chữ & Thang tỷ lệ linh hoạt (Fluid Typography & Clamp Tokens)
* **Font chữ chính:** `Plus Jakarta Sans` cho giao diện hiện đại, `Patrick Hand` cho nét chữ viết tay hoài niệm trên Bảng ghi nhớ, và `JetBrains Mono` cho ngày giờ, mã số và số liệu thống kê.
* **Thang kích cỡ chữ thích nghi (Adaptive Type Scale):**
  * `Display Hero`: `clamp(2.2rem, 1.6rem + 2.6vw, 3.8rem)`
  * `Heading 1`: `clamp(1.8rem, 1.35rem + 1.8vw, 2.5rem)`
  * `Heading 2`: `clamp(1.35rem, 1.15rem + 0.9vw, 1.75rem)`
  * `Heading 3`: `clamp(1.1rem, 0.98rem + 0.5vw, 1.35rem)`
  * `Body Text`: `clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem)`
  * `Container Max`: `min(92vw, 1540px)`

---

## 📑 3. Đặc Tả Chi Tiết Từng Giao Diện

### 3.1. Khung Giao Diện Gốc (`templates/base.html`)
* **Chống FOUC:** Script nội tuyến thực thi đồng bộ ngay đầu thẻ `<head>` đọc `localStorage` và gán thuộc tính `data-theme` lên `<html>` trước khi CSS render.
* **Thanh điều hướng (Navbar):**
  * Brand: Logo hộp thời gian tinh tế kèm tên **Góc Lưu Trữ**.
  * Menu điều hướng: Tất cả lời nhắn (`/`), Không gian trực quan (`/board`), Thống kê (`/stats`), Viết lời nhắn (`/add`).
  * Nút Sun/Moon Toggle mượt mà, hỗ trợ chuyển đổi theme êm ái (`transition: 240ms`).
* **Modal Toàn Cục:** Hộp thoại xác nhận xóa lời nhắn phong cách Glassmorphism kèm hiệu ứng Blur nền mượt mà.

### 3.2. Trang Chủ Danh Sách Lời Nhắn (`templates/index.html`)
* **Hero Section Tinh Giản:**
  * Tiêu đề to rõ, dễ đọc, không còn các dòng chữ rườm rà hay ticker trạng thái thừa thãi.
  * Bộ đếm thông điệp thời gian thực (hiện tại: 114 lời nhắn).
  * 2 Card lời nhắn nổi bật (Lời nhắn mới nhất & Kỷ niệm đầu tiên) có màu sắc tương phản cao, dễ nhìn trong cả Light & Dark Mode.
* **Thanh Công Cụ Tìm Kiếm & Lọc:**
  * Ô tìm kiếm tức thì theo tên tác giả hoặc nội dung.
  * Nút chuyển đổi Mới nhất / Cũ nhất với hiệu ứng mượt mà.
* **Lưới Thẻ Lời Nhắn:**
  * Phong cách card bo góc thanh lịch, có nút Sao chép nội dung và nút Xóa kích hoạt modal an toàn.

### 3.3. Không Gian Trực Quan (`templates/board.html`)
* **Bảng Ghi Nhớ Tự Do (Free-Floating Memory Board):**
  * Loại bỏ hoàn toàn khung bọc cứng nhắc, các thẻ ghi chú tự do trôi trong không gian canvas rộng lớn.
  * Thẻ Polaroid hoài niệm với băng keo Washi thủ công dán góc, 6 tone màu phấn vintage tự nhiên.
  * Tên tác giả hiển thị nét chữ viết tay hoài niệm (`Patrick Hand`).
* **Focus Mode Overlay:**
  * Khi click vào bất kỳ thẻ nào, thẻ đó phóng to mượt mà ra chính giữa màn hình với hiệu ứng chiều sâu, cho phép đọc trọn vẹn thông điệp trong không gian tĩnh lặng.

### 3.4. Trang Thêm Lời Nhắn Mới (`templates/add.html`)
* **Form Nhập Liệu Tối Giản:**
  * Trường nhập Tên tác giả và Nội dung lời nhắn.
  * Hỗ trợ phím tắt `Ctrl + Enter` gửi bài nhanh, bộ đếm ký tự trực quan và thông báo lỗi server-side rõ ràng.

### 3.5. Trang Thống Kê & Bục Olympic (`templates/stats.html`)
* **4 Thẻ Bento KPI:** Tổng lời nhắn, Người đóng góp, Đóng góp hàng đầu, Mật độ tương tác trung bình.
* **Khung Biểu Đồ Phân Bố Matplotlib:**
  * Kết xuất ảnh đồ thị 200 DPI tự động với dải màu Vibrant Gradient trẻ trung, không bị chìm màu ở cả 2 chế độ. Đã loại bỏ hàng chip trùng lặp phía dưới để khung hình gọn gàng, liền mạch.
* **Bục Đứng Vinh Danh Olympic (Olympic Podium Stand):**
  * Bố cục 3 bậc vinh quang chuẩn quốc tế:
    - Bậc 2 (Bạc / Á Quân) bên trái (chiều cao `105px`)
    - Bậc 1 (Vàng / Quán Quân) ở giữa (chiều cao `140px`, vương miện sao, avatar vàng)
    - Bậc 3 (Đồng / Quý Quân) bên phải (chiều cao `75px`)
  - Chân bệ đài (Pedestal Base) ánh kim nâng đỡ cả 3 bậc.
  - Số thứ hạng to rõ `2`, `1`, `3` căn giữa bục, không còn chữ danh hiệu hay pill phần trăm rườm rà.
