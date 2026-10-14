# ADR-0003: Chiến Lược Lưu Trữ Bền Vững (JSON Storage) & Thiết Kế Mở Rộng MySQL

## Trạng Thái
ĐÃ CHẤP NHẬN (ACCEPTED) - 2026-10-14

## Bối Cảnh
Ứng dụng Guestbook yêu cầu dữ liệu phải được lưu trữ bền vững (Persistent Storage), không bị mất khi khởi động lại tiến trình server hoặc tắt máy. Cần xác định chiến lược lưu trữ dữ liệu tối ưu: Có nên bắt buộc cài đặt hệ quản trị cơ sở dữ liệu MySQL trên máy cục bộ hay sử dụng cơ chế file JSON có cấu trúc?

## Các Phương Án Cân Nhắc
1. **Bắt buộc sử dụng MySQL Server cục bộ:**
   * Dữ liệu được lưu trong bảng quan hệ của MySQL Server (`localhost:3306`).
   * *Rủi ro lớn:* Gây phụ thuộc chặt vào môi trường máy tính cục bộ. Khi chia sẻ mã nguồn, nộp bài hoặc chạy thử trên máy tính của người khác (chẳng hạn máy của giảng viên hoặc đồng nghiệp), ứng dụng sẽ lập tức báo lỗi kết nối nếu môi trường đó chưa cài đặt hoặc chưa cấu hình MySQL Service, tài khoản và database `guestbook_db`.
2. **Lưu trữ bền vững bằng file JSON chuẩn hóa (`data.json`):**
   * Sử dụng thư viện `json` có sẵn của Python để đọc và đồng bộ dữ liệu vào file `data.json`.
   * *Ưu điểm:* Zero-dependency (không cần cài thêm bất kỳ dịch vụ hay phần mềm ngoài nào). Mã nguồn hoàn toàn di động, tải về là chạy ngay 100% trên Windows, macOS hoặc Linux.
   * *Khả năng đáp ứng:* Cực kỳ hiệu quả cho quy mô sổ lưu bút từ hàng trăm đến hàng ngàn lời nhắn.
3. **Mô hình kết hợp (Storage Adapter Architecture):**
   * Mặc định triển khai bằng file `data.json` chuẩn hóa để đảm bảo tính an toàn và di động tuyệt đối.
   * Đồng thời thiết kế cấu trúc dữ liệu theo đúng chuẩn thực thể quan hệ (Schema SQL), sẵn sàng chuyển đổi sang kết nối MySQL thông qua một Storage Adapter khi cần triển khai trên môi trường sản xuất thực tế.

## Quyết Định
Lựa chọn **Phương án 3: Lưu trữ chính thức bằng file `data.json` bền vững và chuẩn bị sẵn thiết kế Schema cho MySQL**.

## Hệ Quả & Lợi Ích
* **Tính di động tối đa:** Người dùng và người chấm điểm có thể clone repository và chạy ngay bằng lệnh `python app.py` mà không phải đối mặt với bất kỳ lỗi kết nối cơ sở dữ liệu nào.
* **Độ bền dữ liệu:** Mỗi thao tác thêm mới hoặc xóa lời nhắn đều được đồng bộ tức thời xuống đĩa cứng với định dạng JSON rõ ràng, có thụt lề chuẩn (`indent=2`) và hỗ trợ đầy đủ tiếng Việt (`ensure_ascii=False`).
* **Sẵn sàng nâng cấp:** Lược đồ bảng SQL (`entries`) và tài liệu hướng dẫn tích hợp đã được đặc tả chi tiết trong `vibe_code/docs/DATA_MODEL.md`, cho phép nâng cấp lên MySQL bất cứ khi nào có yêu cầu mở rộng quy mô lớn.
