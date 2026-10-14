import os
import json
import time
from collections import Counter
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for

# Thiết lập backend Agg cho Matplotlib để không cần hiển thị giao diện đồ họa cửa sổ
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

app = Flask(__name__)

# Thiết lập đường dẫn tương đối ổn định theo thư mục chứa file app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
CHART_PATH = os.path.join(STATIC_DIR, 'stats.png')

# Tạo thư mục static nếu chưa tồn tại
os.makedirs(STATIC_DIR, exist_ok=True)


def load_entries():
    """
    Đọc danh sách lời nhắn từ file data.json.
    Nếu file chưa tồn tại hoặc bị lỗi, trả về danh sách rỗng.
    """
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def save_entries(entries):
    """
    Ghi danh sách lời nhắn vào file data.json.
    Dữ liệu được lưu dạng JSON có định dạng đẹp (indent=2) và hỗ trợ tiếng Việt.
    """
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


def generate_chart(top_senders):
    """
    Vẽ biểu đồ cột (Bar Chart) minh họa số lượng lời nhắn theo người gửi bằng Matplotlib.
    Biểu đồ được lưu thành file static/stats.png để nhúng vào trang HTML.
    """
    fig, ax = plt.subplots(figsize=(7, 4), dpi=120)

    if not top_senders:
        ax.text(0.5, 0.5, 'Chưa có dữ liệu lời nhắn',
                horizontalalignment='center', verticalalignment='center',
                fontsize=12, color='#666666')
        ax.set_axis_off()
    else:
        names = [item[0] for item in top_senders]
        counts = [item[1] for item in top_senders]

        # Màu sắc cột đơn giản, rõ ràng
        bars = ax.bar(names, counts, color='#2563eb', width=0.5, edgecolor='#1d4ed8')

        # Hiển thị số lượng cụ thể trên đỉnh mỗi cột
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{height}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 4),
                        textcoords="offset points",
                        ha='center', va='bottom',
                        fontsize=10, fontweight='bold', color='#1e293b')

        ax.set_title('Top 5 Người Gửi Nhiều Lời Nhắn Nhất', fontsize=12, fontweight='bold', pad=12)
        ax.set_xlabel('Người gửi', fontsize=10, fontweight='bold')
        ax.set_ylabel('Số lời nhắn', fontsize=10, fontweight='bold')

        # Đảm bảo trục tung hiển thị số nguyên
        max_count = max(counts) if counts else 1
        ax.set_yticks(range(0, max_count + 2))
        ax.set_ylim(0, max_count + 1)
        ax.grid(axis='y', linestyle=':', alpha=0.6)

        # Xoay nhãn nhẹ nếu tên dài
        plt.xticks(rotation=15, ha='right', fontsize=9)

    plt.tight_layout()
    plt.savefig(CHART_PATH)
    plt.close(fig)


@app.route('/')
def index():
    """
    Route / (GET):
    - Lấy danh sách tất cả lời nhắn từ file data.json.
    - Render template index.html với biến entries.
    """
    entries = load_entries()
    return render_template('index.html', entries=entries)


@app.route('/add', methods=['GET', 'POST'])
def add():
    """
    Route /add (GET, POST):
    - GET: Hiển thị form gồm 2 input: name và message.
    - POST:
      + Kiểm tra không để trống cả hai trường.
      + Nếu hợp lệ: tự động sinh ID, thêm vào data.json và redirect về /.
      + Nếu lỗi: render lại form kèm thông báo lỗi.
    """
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        message = request.form.get('message', '').strip()

        # Kiểm tra không để trống cả hai trường
        if not name or not message:
            error = "Vui lòng nhập đầy đủ cả Tên người gửi và Lời nhắn!"
            return render_template('add.html', error=error, name=name, message=message)

        entries = load_entries()

        # Sinh ID mới tự tăng (ID lớn nhất hiện tại + 1)
        new_id = max([e.get('id', 0) for e in entries], default=0) + 1
        created_at = datetime.now().strftime('%d/%m/%Y %H:%M')

        new_entry = {
            'id': new_id,
            'name': name,
            'message': message,
            'created_at': created_at
        }

        entries.append(new_entry)
        save_entries(entries)

        return redirect(url_for('index'))

    return render_template('add.html')


@app.route('/delete/<int:id>', methods=['GET', 'POST'])
def delete(id):
    """
    Route /delete/<int:id> (POST hoặc GET):
    - Xóa lời nhắn có ID tương ứng khỏi data.json.
    - Redirect về trang chủ /.
    """
    entries = load_entries()
    filtered_entries = [e for e in entries if e.get('id') != id]

    # Lưu lại file nếu có thay đổi
    if len(filtered_entries) != len(entries):
        save_entries(filtered_entries)

    return redirect(url_for('index'))


@app.route('/stats')
def stats():
    """
    Route /stats (GET):
    - Hiển thị tổng số lời nhắn đã ghi.
    - Hiển thị danh sách 5 người gửi nhiều lời nhắn nhất (tính theo name).
    - Tạo biểu đồ cột bằng Matplotlib, lưu thành static/stats.png và nhúng vào trang HTML.
    """
    entries = load_entries()
    total_entries = len(entries)

    # Đếm số lượng lời nhắn theo tên người gửi
    senders = [e.get('name', '').strip() for e in entries if e.get('name')]
    sender_counts = Counter(senders)
    top_senders = sender_counts.most_common(5)

    # Tạo biểu đồ cột Matplotlib
    generate_chart(top_senders)

    # Thêm timestamp vào đường dẫn ảnh để trình duyệt không lưu cache ảnh cũ
    chart_timestamp = int(time.time())

    return render_template('stats.html',
                           total_entries=total_entries,
                           top_senders=top_senders,
                           chart_timestamp=chart_timestamp)


if __name__ == '__main__':
    print("Khởi chạy ứng dụng Guestbook tại http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
