import os
import json
from collections import Counter
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for

# Sử dụng backend Agg cho Matplotlib để vẽ không cần màn hình GUI
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

app = Flask(__name__)

# Đường dẫn file dữ liệu JSON
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')
STATS_IMAGE = os.path.join(STATIC_DIR, 'stats.png')

# Đảm bảo thư mục static tồn tại
os.makedirs(STATIC_DIR, exist_ok=True)


def load_entries():
    """Đọc danh sách lời nhắn từ file data.json."""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def save_entries(entries):
    """Ghi danh sách lời nhắn ra file data.json."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


def generate_stats_chart(top_senders):
    """
    Tạo biểu đồ cột bằng Matplotlib và lưu vào static/stats.png.
    Thiết kế hiện đại, tinh tế theo phong cách Swiss/Neo-Editorial (Cobalt & Slate palette).
    """
    # Kích thước biểu đồ chuẩn tỉ lệ 16:9 với DPI cao (200) cho màn hình Retina/4K
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=200)
    
    if not top_senders:
        # Nếu chưa có dữ liệu
        ax.text(0.5, 0.5, 'Chưa có dữ liệu để vẽ biểu đồ', 
                horizontalalignment='center', verticalalignment='center',
                fontsize=13, color='#64748b', fontfamily='sans-serif')
        ax.set_axis_off()
    else:
        names = [item[0] for item in top_senders]
        counts = [item[1] for item in top_senders]

        # Bảng màu Cobalt & Slate tinh tế, cao cấp (không dùng tím AI slop)
        colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][:len(names)]
        
        # Vẽ biểu đồ cột bo tròn nhẹ
        bars = ax.bar(names, counts, color=colors, width=0.52, edgecolor='#1d4ed8', linewidth=1.2, zorder=3)
        
        # Hiển thị nhãn số lượng trên đầu mỗi cột
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{int(height)}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 6),
                        textcoords="offset points",
                        ha='center', va='bottom',
                        fontsize=11, fontweight='bold', color='#1e293b',
                        fontfamily='sans-serif')

        # Tùy biến trục & tiêu đề
        ax.set_title('Top 5 Người Để Lại Lời Nhắn Nhiều Nhất', fontsize=13, fontweight='bold', pad=18, color='#0f172a', fontfamily='sans-serif')
        ax.set_xlabel('Người gửi', fontsize=10, fontweight='bold', labelpad=10, color='#475569', fontfamily='sans-serif')
        ax.set_ylabel('Số lượng lời nhắn', fontsize=10, fontweight='bold', labelpad=10, color='#475569', fontfamily='sans-serif')
        
        # Lưới ngang nhẹ nhàng
        ax.grid(axis='y', linestyle='--', alpha=0.25, color='#94a3b8', zorder=0)
        ax.set_axisbelow(True)
        
        # Đảm bảo trục y là số nguyên
        max_count = max(counts) if counts else 1
        ax.set_yticks(range(0, max_count + 2))
        ax.set_ylim(0, max_count + 1)

        # Xóa viền trên và phải
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#cbd5e1')
        ax.spines['bottom'].set_color('#cbd5e1')

        # Nhãn trục X
        plt.xticks(rotation=15, ha='right', fontsize=9.5, color='#334155', fontfamily='sans-serif')
        plt.yticks(fontsize=9.5, color='#475569', fontfamily='sans-serif')

    plt.tight_layout()
    plt.savefig(STATS_IMAGE, transparent=True, bbox_inches='tight')
    plt.close(fig)


@app.route('/')
def index():
    """
    Route / (GET):
    Lấy danh sách tất cả lời nhắn (từ data.json).
    Render template index.html với biến entries.
    """
    entries = load_entries()
    # Sắp xếp hiển thị lời nhắn mới nhất lên đầu (theo id giảm dần)
    sorted_entries = sorted(entries, key=lambda x: x.get('id', 0), reverse=True)
    return render_template('index.html', entries=sorted_entries)


@app.route('/add', methods=['GET', 'POST'])
def add():
    """
    Route /add (GET, POST):
    GET: hiển thị form gồm hai input: name, message.
    POST:
      - Kiểm tra không để trống cả hai trường.
      - Nếu hợp lệ: thêm vào dữ liệu, redirect về /.
      - Nếu lỗi: render lại form với thông báo lỗi.
    """
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        message = request.form.get('message', '').strip()

        # Kiểm tra không để trống cả hai trường
        if not name or not message:
            error = "Vui lòng nhập đầy đủ cả tên và nội dung lời nhắn (không được để trống)!"
            return render_template('add.html', error=error, name=name, message=message)

        entries = load_entries()
        
        # Sinh ID mới tự tăng
        new_id = max([e.get('id', 0) for e in entries], default=0) + 1
        
        # Thời gian gửi lời nhắn
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M')

        new_entry = {
            'id': new_id,
            'name': name,
            'message': message,
            'created_at': created_at
        }

        entries.append(new_entry)
        save_entries(entries)

        # Chuyển hướng về trang chủ
        return redirect(url_for('index'))

    return render_template('add.html')


@app.route('/delete/<int:id>', methods=['GET', 'POST'])
def delete(id):
    """
    Route /delete/<int:id> (POST hoặc GET):
    Xóa entry có ID tương ứng.
    Redirect về /.
    """
    entries = load_entries()
    updated_entries = [e for e in entries if e.get('id') != id]
    
    # Chỉ ghi lại nếu có sự thay đổi
    if len(updated_entries) != len(entries):
        save_entries(updated_entries)

    return redirect(url_for('index'))


@app.route('/stats')
def stats():
    """
    Route /stats (GET):
    - Tổng số lời nhắn đã ghi.
    - Danh sách 5 người gửi nhiều lời nhắn nhất (tính theo name).
    - Biểu đồ cột bằng Matplotlib lưu tạm thành file PNG nhúng vào template.
    """
    entries = load_entries()
    total_entries = len(entries)

    # Thống kê top 5 người gửi nhiều nhất theo 'name'
    sender_counts = Counter(e.get('name', 'Ẩn danh').strip() for e in entries if e.get('name'))
    top_senders = sender_counts.most_common(5)

    # Vẽ và lưu biểu đồ ra static/stats.png
    generate_stats_chart(top_senders)

    unique_authors = len(sender_counts)
    top_contributor = top_senders[0][0] if top_senders else "Chưa có"

    return render_template('stats.html',
                           entries=entries,
                           total_entries=total_entries,
                           top_senders=top_senders,
                           unique_authors=unique_authors,
                           top_contributor=top_contributor)


if __name__ == '__main__':
    print("Starting Vibe Code Guestbook at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
