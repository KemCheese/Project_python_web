/* ==========================================================================
   DESIGN-TASTE-FRONTEND: ARCHITECTURAL CLIENT JAVASCRIPT
   - Theme toggle (Dark / Light with local storage persistence)
   - Mobile responsive menu navigation
   - Real-time search filtering with clear action
   - Dynamic sorting pills (Newest / Oldest)
   - Quick copy message with toast feedback
   - Keyboard accessible delete confirmation modal
   - Form character counter & Ctrl+Enter submit shortcut
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME TOGGLE (DARK / LIGHT) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('vibe_chronicle_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('vibe_chronicle_theme', newTheme);
      showToast(newTheme === 'dark' ? 'Đã chuyển sang giao diện Tối' : 'Đã chuyển sang giao diện Sáng');
    });
  }

  // --- 2. MOBILE MENU DRAWER ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // --- 3. TOAST NOTIFICATION SYSTEM ---
  const toastShelf = document.getElementById('toastShelf');

  function showToast(message, duration = 2800) {
    if (!toastShelf) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    toastShelf.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // --- 4. REAL-TIME SEARCH & SORTING ---
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const resetSearchBtn = document.getElementById('resetSearchBtn');
  const entriesGrid = document.getElementById('entriesGrid');
  const searchEmptyState = document.getElementById('searchEmptyState');
  const countBadge = document.getElementById('countBadge');

  if (searchInput && entriesGrid) {
    const filterEntries = () => {
      const query = searchInput.value.trim().toLowerCase();
      const cards = entriesGrid.querySelectorAll('.entry-card');
      let visibleCount = 0;

      // Hiển thị/ẩn nút Xóa tìm kiếm
      if (searchClearBtn) {
        searchClearBtn.style.display = query.length > 0 ? 'block' : 'none';
      }

      cards.forEach((card) => {
        const author = card.getAttribute('data-author') || '';
        const message = card.getAttribute('data-message') || '';

        if (author.includes(query) || message.includes(query)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (searchEmptyState) {
        searchEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      if (countBadge) {
        countBadge.textContent = `${visibleCount} ghi nhận`;
      }
    };

    searchInput.addEventListener('input', filterEntries);

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterEntries();
        searchInput.focus();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterEntries();
        searchInput.focus();
      });
    }

    // --- SORTING (NEWEST / OLDEST) ---
    const sortNewest = document.getElementById('sortNewest');
    const sortOldest = document.getElementById('sortOldest');

    const sortCards = (ascending = false) => {
      const cards = Array.from(entriesGrid.querySelectorAll('.entry-card'));
      cards.sort((a, b) => {
        const idA = parseInt(a.getAttribute('data-id') || 0, 10);
        const idB = parseInt(b.getAttribute('data-id') || 0, 10);
        return ascending ? idA - idB : idB - idA;
      });

      cards.forEach(card => entriesGrid.appendChild(card));
    };

    if (sortNewest && sortOldest) {
      sortNewest.addEventListener('click', () => {
        sortNewest.classList.add('active');
        sortOldest.classList.remove('active');
        sortCards(false);
      });

      sortOldest.addEventListener('click', () => {
        sortOldest.classList.add('active');
        sortNewest.classList.remove('active');
        sortCards(true);
      });
    }
  }

  // --- 5. QUICK COPY MESSAGE ACTION ---
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy-msg');
    if (copyBtn) {
      e.preventDefault();
      const text = copyBtn.getAttribute('data-copy-text') || '';
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Đã sao chép nội dung lời nhắn vào clipboard');
        }).catch(() => {
          showToast('Không thể tự động sao chép, vui lòng sao chép thủ công');
        });
      }
    }
  });

  // --- 6. ACCESSIBLE DELETE CONFIRMATION MODAL ---
  const deleteModal = document.getElementById('deleteModal');
  const modalAuthorName = document.getElementById('modalAuthorName');
  const modalConfirmDeleteBtn = document.getElementById('modalConfirmDeleteBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-delete-trigger');
    if (trigger) {
      e.preventDefault();
      const authorName = trigger.getAttribute('data-name') || 'người gửi';
      const deleteUrl = trigger.getAttribute('data-delete-url') || '#';

      if (modalAuthorName) modalAuthorName.textContent = authorName;
      if (modalConfirmDeleteBtn) modalConfirmDeleteBtn.setAttribute('href', deleteUrl);
      if (deleteModal) {
        deleteModal.classList.add('show');
        deleteModal.setAttribute('aria-hidden', 'false');
        if (modalCancelBtn) modalCancelBtn.focus();
      }
    }
  });

  function closeModal() {
    if (deleteModal) {
      deleteModal.classList.remove('show');
      deleteModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && deleteModal && deleteModal.classList.contains('show')) {
      closeModal();
    }
  });

  // --- 7. FORM UX: CHARACTER COUNTER & CTRL+ENTER SHORTCUT ---
  const messageInput = document.getElementById('messageInput');
  const charCount = document.getElementById('charCount');
  const addEntryForm = document.getElementById('addEntryForm');
  const submitBtn = document.getElementById('submitBtn');

  if (messageInput && charCount) {
    const updateCount = () => {
      const len = messageInput.value.length;
      charCount.textContent = `${len}/500`;
      if (len > 460) {
        charCount.style.color = 'var(--danger)';
      } else {
        charCount.style.color = 'var(--text-muted)';
      }
    };

    messageInput.addEventListener('input', updateCount);
    updateCount();

    // Phím tắt Ctrl + Enter hoặc Cmd + Enter để gửi nhanh
    messageInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (addEntryForm && messageInput.value.trim()) {
          addEntryForm.requestSubmit();
        }
      }
    });
  }

  if (addEntryForm && submitBtn) {
    addEntryForm.addEventListener('submit', () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Đang ghi nhận...</span>
      `;
    });
  }
});
