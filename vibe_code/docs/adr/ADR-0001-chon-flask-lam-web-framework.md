# ADR-0001: Chọn Flask Làm Web Framework Chính Thức

## Trạng Thái
ĐÃ CHẤP NHẬN (ACCEPTED) - 2026-10-14

## Bối Cảnh
Dự án Vibe Code Guestbook yêu cầu xây dựng một ứng dụng web sổ lưu bút tinh gọn nhưng hoàn thiện cao về tính năng và trải nghiệm người dùng, bao gồm:
* Tiếp nhận và phân phối các tuyến đường HTTP: `/`, `/add`, `/delete/<int:id>`, `/stats`.
* Tích hợp render giao diện bằng template engine có khả năng tái sử dụng layout gốc (`base.html`).
* Tích hợp dịch vụ sinh biểu đồ động bằng Matplotlib để nhúng vào trang báo cáo.
* Đảm bảo tính nhẹ nhàng, mã nguồn rõ ràng và dễ bảo trì.

## Các Phương Án Cân Nhắc
1. **Flask:** Micro-framework chuẩn mực của Python, tích hợp sẵn Jinja2 template engine, xử lý routing trực quan, không ràng buộc cấu trúc cứng nhắc, dễ dàng tích hợp các dịch vụ đồ họa như Matplotlib.
2. **FastAPI:** Hiệu năng cao, tuy nhiên thế mạnh chính là xây dựng REST API / JSON API bất đồng bộ (async). Việc xử lý Jinja2 templates và form submission truyền thống đòi hỏi cấu hình bổ sung không cần thiết cho ứng dụng web server-rendered.
3. **Django:** Full-stack framework mạnh mẽ, nhưng cấu trúc quá cồng kềnh với hàng loạt file cấu hình (settings, wsgi, asgi, admin, ORM migration...) gây dư thừa tài nguyên cho một ứng dụng tập trung vào tính trực quan và nhanh nhẹn.

## Quyết Định
Lựa chọn **Flask** làm Web Framework chính thức của dự án.

## Hệ Quả & Lợi Ích
* **Ưu điểm:**
  * Toàn bộ luồng điều khiển nghiệp vụ (Controller) được tổ chức tập trung, mạch lạc và trực quan.
  * Tận dụng tối đa sức mạnh của Jinja2 template engine để chia sẻ layout dùng chung và render dữ liệu động dạng Card.
  * Tích hợp liền mạch với thư viện Matplotlib (backend Agg) để tự động xuất file biểu đồ phân tích tĩnh mà không gặp xung đột luồng xử lý.
* **Ràng buộc:** Cần chủ động tổ chức cấu trúc thư mục tĩnh (static assets) và templates khoa học để duy trì tính sạch sẽ của mã nguồn.
