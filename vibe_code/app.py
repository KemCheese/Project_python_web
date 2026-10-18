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
    Tạo biểu đồ phân bố số lượng lời nhắn và lưu vào static/stats.png.
    Thiết kế theo phong cách Youthful Gradient:
    - Nền trong suốt (Transparent) hòa quyện hoàn hảo cả Dark Mode và Light Mode.
    - Bảng màu Gradient cao cấp: Electric Sky, Vivid Indigo, Luminous Rose, Mint Emerald, Warm Amber.
    - Cột cân đối, chữ sắc nét, độ phân giải cao (200 DPI).
    """
    fig, ax = plt.subplots(figsize=(8.2, 4.0), dpi=200)
    
    # Nền trong suốt, không bị viền trắng thô kệch
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    
    if not top_senders:
        ax.text(0.5, 0.5, 'Chưa có đủ dữ liệu để kết xuất biểu đồ', 
                horizontalalignment='center', verticalalignment='center',
                fontsize=12, color='#94a3b8', fontfamily='sans-serif', fontweight='500')
        ax.set_axis_off()
    else:
        names = [item[0] for item in top_senders]
        counts = [item[1] for item in top_senders]

        # Bảng màu Vibrant Gradient trẻ trung, tương thích cả nền tối và sáng
        palette = ['#38bdf8', '#818cf8', '#f43f5e', '#34d399', '#fbbf24']
        colors = palette[:len(names)]
        
        # Vẽ biểu đồ cột hiện đại
        bars = ax.bar(names, counts, color=colors, width=0.44, zorder=3, edgecolor='none')
        
        # Nhãn số lượng trên đầu mỗi cột
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{int(height)}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 7),
                        textcoords="offset points",
                        ha='center', va='bottom',
                        fontsize=11.5, fontweight='700', color='#38bdf8',
                        fontfamily='sans-serif')

        # Tiêu đề và nhãn trục
        ax.set_title('Phân bố số lượng lời nhắn theo tác giả', fontsize=12.5, fontweight='700', pad=18, color='#94a3b8', fontfamily='sans-serif')
        ax.set_xlabel('Tác giả', fontsize=10, fontweight='600', labelpad=10, color='#94a3b8', fontfamily='sans-serif')
        ax.set_ylabel('Số lời nhắn', fontsize=10, fontweight='600', labelpad=10, color='#94a3b8', fontfamily='sans-serif')
        
        # Lưới ngang nhẹ nhàng
        ax.grid(axis='y', linestyle='--', linewidth=0.75, alpha=0.3, color='#94a3b8', zorder=0)
        ax.set_axisbelow(True)
        
        # Trục Y nguyên số
        max_count = max(counts) if counts else 1
        ax.set_yticks(range(0, max_count + 2))
        ax.set_ylim(0, max_count + 1.2)

        # Viền tối giản thanh thoát
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#64748b')
        ax.spines['left'].set_alpha(0.35)
        ax.spines['bottom'].set_color('#64748b')
        ax.spines['bottom'].set_alpha(0.35)

        # Định dạng nhãn trục
        plt.xticks(rotation=0, ha='center', fontsize=9.5, color='#94a3b8', fontfamily='sans-serif', fontweight='600')
        plt.yticks(fontsize=9.5, color='#94a3b8', fontfamily='sans-serif')

    plt.tight_layout()
    plt.savefig(STATS_IMAGE, transparent=True, edgecolor='none', bbox_inches='tight')
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


@app.route('/board')
def board():
    """
    Route /board (GET):
    Trang Bảng Ghim Kỷ Niệm (Corkboard Memory Pinboard):
    Hiển thị toàn bộ ghi chú dưới dạng bảng ghim bần nghệ thuật với đinh ghim,
    băng dính washi tape, hiệu ứng nổi bồng bềnh khi di chuột và layer phóng to khi chọn.
    """
    entries = load_entries()
    return render_template('board.html', entries=entries)


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
    - Danh sách 5 người gửi nhiều lời nhắn nhất (tính theo name đã chuẩn hóa khoảng trắng).
    - Biểu đồ cột bằng Matplotlib lưu tạm thành file PNG nhúng vào template.
    """
    entries = load_entries()
    total_entries = len(entries)

    # Chuẩn hóa khoảng trắng tên tác giả để thống kê chuẩn xác
    clean_names = []
    for e in entries:
        raw_name = e.get('name', '').strip()
        if raw_name:
            norm_name = ' '.join(raw_name.split())
            clean_names.append(norm_name)

    sender_counts = Counter(clean_names)
    top_senders = sender_counts.most_common(5)

    # Vẽ và lưu biểu đồ ra static/stats.png
    generate_stats_chart(top_senders)

    unique_authors = len(sender_counts)
    top_contributor = top_senders[0][0] if top_senders else "Chưa có"
    avg_per_author = round(total_entries / unique_authors, 1) if unique_authors > 0 else 0

    return render_template('stats.html',
                           entries=entries,
                           total_entries=total_entries,
                           top_senders=top_senders,
                           unique_authors=unique_authors,
                           top_contributor=top_contributor,
                           avg_per_author=avg_per_author)


if __name__ == '__main__':
    print("Starting Vibe Code Guestbook at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
