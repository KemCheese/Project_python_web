# ADR-0002: Xây Dựng Hệ Thống Giao Diện Design System Tokens & Glassmorphism

## Trạng Thái
ĐÃ CHẤP NHẬN (ACCEPTED) - 2026-10-14

## Bối Cảnh
Phiên bản **Vibe Code Guestbook** hướng tới mục tiêu tạo ra trải nghiệm người dùng cao cấp, trực quan và ấn tượng (Wow Factor). Giao diện không chỉ dừng lại ở mức hiển thị thông tin mà cần có chiều sâu thẩm mỹ, phân cấp trực quan rõ ràng, hiệu ứng chuyển động mượt mà và tính nhất quán trên toàn bộ các trang.

Cần lựa chọn giải pháp kiến trúc giao diện phù hợp với mô hình render template của Python Flask.

## Các Phương Án Cân Nhắc
1. **Sử dụng CSS rời rạc không có hệ thống:** Viết CSS ad-hoc cho từng trang. Nhược điểm: Mã nguồn nhanh chóng bị trùng lặp, màu sắc và khoảng cách không đồng nhất, khó bảo trì.
2. **Tích hợp CSS Framework nặng (Bootstrap / Tailwind qua Node.js/NPM):** Nhược điểm: Làm phức tạp hóa quy trình triển khai vì buộc phải cài đặt môi trường Node.js kèm công cụ build (Webpack / Vite), làm giảm tính độc lập của một dự án Python.
3. **Xây dựng Design System thuần (Vanilla CSS) với CSS Custom Properties (Tokens), Glassmorphism & JavaScript gốc:** Tạo file `style.css` tập trung định nghĩa toàn bộ Color Tokens, Typography, Shadow Elevation và hiệu ứng Glassmorphism. Kết hợp cùng `main.js` để xử lý các micro-interactions (như Modal xác nhận xóa, Card hover animation).

## Quyết Định
Lựa chọn **Phương án 3: Xây dựng Design System thuần dựa trên CSS Custom Properties và hiệu ứng Glassmorphism**.

## Hệ Quả & Lợi Ích
* **Ưu điểm:**
  * **Zero-dependency Frontend:** Ứng dụng không cần Node.js, không cần bước build phức tạp, chạy trực tiếp trên bất kỳ trình duyệt nào.
  * **Tính thẩm mỹ vượt trội:** Đạt được phong cách giao diện hiện đại với bảng màu HSL Indigo-Violet, hiệu ứng làm mờ kính (`backdrop-filter`) và hiệu ứng chuyển động mượt mà.
  * **Tính tái sử dụng cao:** Mọi trang con (`index.html`, `add.html`, `stats.html`) đều kế thừa từ `base.html` và sử dụng chung bộ Tokens, đảm bảo tính thông suốt và thống nhất 100%.
  * **Trải nghiệm an toàn:** Thao tác xóa được trang bị Modal xác nhận mượt mà thay vì popup mặc định thô sơ của trình duyệt.
