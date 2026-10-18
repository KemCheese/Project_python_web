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
  // --- 1. THEME TOGGLE (DARK / LIGHT) WITH SMOOTH INTERACTIVE TRANSITION ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Đảm bảo đồng bộ với theme đã được nạp từ head script
  const savedTheme = localStorage.getItem('vibe_chronicle_theme') || htmlElement.getAttribute('data-theme') || 'light';
  if (!htmlElement.getAttribute('data-theme')) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Chỉ bật transition khi người dùng chủ động nhấp nút chuyển đổi
      htmlElement.classList.add('theme-transitioning');
      
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('vibe_chronicle_theme', newTheme);
      showToast(newTheme === 'dark' ? 'Đã chuyển sang chế độ Tối' : 'Đã chuyển sang chế độ Sáng');

      setTimeout(() => {
        htmlElement.classList.remove('theme-transitioning');
      }, 420);
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

    // --- SORTING (NEWEST / OLDEST) WITH SLIDING GLIDER & SMOOTH SHUFFLE ---
    const sortNewest = document.getElementById('sortNewest');
    const sortOldest = document.getElementById('sortOldest');
    const sortGlider = document.getElementById('sortGlider');
    const filterPillsGroup = document.getElementById('filterPillsGroup');

    function updateGlider(activeBtn, animate = true) {
      if (!sortGlider || !activeBtn || !filterPillsGroup) return;
      if (!animate) {
        sortGlider.style.transition = 'none';
      } else {
        sortGlider.style.transition = 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1)';
      }
      const left = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;
      sortGlider.style.transform = `translateX(${left}px)`;
      sortGlider.style.width = `${width}px`;
    }

    // Initialize glider position
    setTimeout(() => {
      if (sortNewest && sortNewest.classList.contains('active')) {
        updateGlider(sortNewest, false);
      } else if (sortOldest && sortOldest.classList.contains('active')) {
        updateGlider(sortOldest, false);
      }
    }, 50);

    window.addEventListener('resize', () => {
      const active = (sortNewest && sortNewest.classList.contains('active')) ? sortNewest : sortOldest;
      if (active) updateGlider(active, false);
    });

    const sortCards = (ascending = false) => {
      const cards = Array.from(entriesGrid.querySelectorAll('.entry-card'));
      cards.sort((a, b) => {
        const idA = parseInt(a.getAttribute('data-id') || 0, 10);
        const idB = parseInt(b.getAttribute('data-id') || 0, 10);
        return ascending ? idA - idB : idB - idA;
      });

      // Smooth subtle cross-fade transition during card reordering
      entriesGrid.style.transition = 'opacity 140ms ease, transform 140ms ease';
      entriesGrid.style.opacity = '0.35';
      entriesGrid.style.transform = 'translateY(4px)';

      setTimeout(() => {
        cards.forEach(card => entriesGrid.appendChild(card));
        entriesGrid.style.transition = 'opacity 220ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1)';
        entriesGrid.style.opacity = '1';
        entriesGrid.style.transform = 'translateY(0)';
      }, 140);
    };

    if (sortNewest && sortOldest) {
      sortNewest.addEventListener('click', () => {
        if (sortNewest.classList.contains('active')) return;
        sortNewest.classList.add('active');
        sortOldest.classList.remove('active');
        updateGlider(sortNewest, true);
        sortCards(false);
      });

      sortOldest.addEventListener('click', () => {
        if (sortOldest.classList.contains('active')) return;
        sortOldest.classList.add('active');
        sortNewest.classList.remove('active');
        updateGlider(sortOldest, true);
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

  // --- 8. CORKBOARD PINBOARD FOCUS LAYER MODAL ---
  const noteFocusOverlay = document.getElementById('noteFocusOverlay');
  const focusBackdrop = document.getElementById('focusBackdrop');
  const focusCloseBtn = document.getElementById('focusCloseBtn');
  const focusDoneBtn = document.getElementById('focusDoneBtn');
  const focusAuthorName = document.getElementById('focusAuthorName');
  const focusAvatarText = document.getElementById('focusAvatarText');
  const focusIdPill = document.getElementById('focusIdPill');
  const focusTimePill = document.getElementById('focusTimePill');
  const focusMessageText = document.getElementById('focusMessageText');
  const focusCopyBtn = document.getElementById('focusCopyBtn');
  const focusPrevBtn = document.getElementById('focusPrevBtn');
  const focusNextBtn = document.getElementById('focusNextBtn');
  const focusIndexCounter = document.getElementById('focusIndexCounter');
  const corkPinItems = Array.from(document.querySelectorAll('.cork-pin-item'));

  let currentFocusIndex = -1;
  let isAnimatingFocus = false;

  function openFocusNote(index, clickedElement) {
    if (!corkPinItems.length || index < 0 || index >= corkPinItems.length || isAnimatingFocus) return;
    currentFocusIndex = index;

    const sourceCard = clickedElement || corkPinItems[index];
    const id = sourceCard.getAttribute('data-entry-id') || '0';
    const author = sourceCard.getAttribute('data-entry-author') || 'Bạn giấu tên';
    const date = sourceCard.getAttribute('data-entry-date') || 'Gần đây';
    const message = sourceCard.getAttribute('data-entry-message') || '';

    if (focusAuthorName) focusAuthorName.textContent = author;
    if (focusAvatarText) focusAvatarText.textContent = author.slice(0, 2).toUpperCase();
    if (focusIdPill) focusIdPill.textContent = `#${id.padStart(2, '0')}`;
    if (focusTimePill) focusTimePill.textContent = date;
    if (focusMessageText) focusMessageText.textContent = message;
    if (focusIndexCounter) focusIndexCounter.textContent = `${index + 1} / ${corkPinItems.length}`;

    if (focusPrevBtn) focusPrevBtn.disabled = index === 0;
    if (focusNextBtn) focusNextBtn.disabled = index === corkPinItems.length - 1;

    if (!noteFocusOverlay || !focusCardContent) return;

    // --- FLIP (First, Last, Invert, Play) Animation to center ---
    isAnimatingFocus = true;
    const startRect = sourceCard.getBoundingClientRect();

    noteFocusOverlay.classList.add('show');
    noteFocusOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Last: calculate destination position in center
    const destRect = focusCardContent.getBoundingClientRect();

    // Invert: calculate translate & scale deltas from source card to center
    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top + startRect.height / 2;
    const destCenterX = destRect.left + destRect.width / 2;
    const destCenterY = destRect.top + destRect.height / 2;

    const deltaX = startCenterX - destCenterX;
    const deltaY = startCenterY - destCenterY;
    const scaleX = Math.max(0.35, startRect.width / destRect.width);
    const scaleY = Math.max(0.35, startRect.height / destRect.height);

    // Apply initial inverted state
    focusCardContent.style.transition = 'none';
    focusCardContent.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`;
    focusCardContent.style.opacity = '0.5';

    if (focusBackdrop) {
      focusBackdrop.style.transition = 'none';
      focusBackdrop.style.opacity = '0';
    }

    corkPinItems.forEach(card => card.style.opacity = '');
    sourceCard.style.opacity = '0.2';

    // Force reflow
    void focusCardContent.offsetHeight;

    // Play: animate smoothly into the center focus position
    requestAnimationFrame(() => {
      focusCardContent.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)';
      focusCardContent.style.transform = 'translate3d(0, 0, 0) scale(1)';
      focusCardContent.style.opacity = '1';

      if (focusBackdrop) {
        focusBackdrop.style.transition = 'opacity 320ms ease';
        focusBackdrop.style.opacity = '1';
      }

      setTimeout(() => {
        isAnimatingFocus = false;
        if (focusCloseBtn) focusCloseBtn.focus();
      }, 380);
    });
  }

  function closeFocusNote() {
    if (!noteFocusOverlay || !noteFocusOverlay.classList.contains('show') || isAnimatingFocus) return;
    isAnimatingFocus = true;

    const activeSource = corkPinItems[currentFocusIndex] || corkPinItems[0];
    if (activeSource && focusCardContent) {
      const endRect = activeSource.getBoundingClientRect();
      const destRect = focusCardContent.getBoundingClientRect();

      const deltaX = (endRect.left + endRect.width / 2) - (destRect.left + destRect.width / 2);
      const deltaY = (endRect.top + endRect.height / 2) - (destRect.top + destRect.height / 2);
      const scaleX = Math.max(0.35, endRect.width / destRect.width);
      const scaleY = Math.max(0.35, endRect.height / destRect.height);

      focusCardContent.style.transition = 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease';
      focusCardContent.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`;
      focusCardContent.style.opacity = '0';

      if (focusBackdrop) {
        focusBackdrop.style.transition = 'opacity 240ms ease';
        focusBackdrop.style.opacity = '0';
      }

      setTimeout(() => {
        noteFocusOverlay.classList.remove('show');
        noteFocusOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        focusCardContent.style.transition = '';
        focusCardContent.style.transform = '';
        focusCardContent.style.opacity = '';
        if (focusBackdrop) {
          focusBackdrop.style.transition = '';
          focusBackdrop.style.opacity = '';
        }
        corkPinItems.forEach(card => card.style.opacity = '');
        isAnimatingFocus = false;
      }, 280);
    } else {
      noteFocusOverlay.classList.remove('show');
      noteFocusOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      corkPinItems.forEach(card => card.style.opacity = '');
      isAnimatingFocus = false;
    }
  }

  if (corkPinItems.length) {
    corkPinItems.forEach((item, idx) => {
      item.addEventListener('click', (e) => openFocusNote(idx, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFocusNote(idx, item);
        }
      });
    });

    if (focusCloseBtn) focusCloseBtn.addEventListener('click', closeFocusNote);
    if (noteFocusOverlay) {
      noteFocusOverlay.addEventListener('click', (e) => {
        if (!e.target.closest('#focusCardContent')) {
          closeFocusNote();
        }
      });
    }

    if (focusPrevBtn) {
      focusPrevBtn.addEventListener('click', () => {
        if (currentFocusIndex > 0) openFocusNote(currentFocusIndex - 1);
      });
    }

    if (focusNextBtn) {
      focusNextBtn.addEventListener('click', () => {
        if (currentFocusIndex < corkPinItems.length - 1) openFocusNote(currentFocusIndex + 1);
      });
    }

    if (focusCopyBtn) {
      focusCopyBtn.addEventListener('click', () => {
        if (currentFocusIndex >= 0 && currentFocusIndex < corkPinItems.length) {
          const item = corkPinItems[currentFocusIndex];
          const text = item.getAttribute('data-entry-message') || '';
          if (navigator.clipboard && text) {
            navigator.clipboard.writeText(text).then(() => {
              showToast('Đã sao chép lời nhắn vào clipboard');
            });
          }
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!noteFocusOverlay || !noteFocusOverlay.classList.contains('show')) return;

      if (e.key === 'Escape') {
        closeFocusNote();
      } else if (e.key === 'ArrowLeft' && currentFocusIndex > 0) {
        openFocusNote(currentFocusIndex - 1);
      } else if (e.key === 'ArrowRight' && currentFocusIndex < corkPinItems.length - 1) {
        openFocusNote(currentFocusIndex + 1);
      }
    });
  }

  // --- 9. SILKY TAB SWITCHING & CROSS-PAGE TRANSITIONS ---
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-is-exiting');
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || link.target === '_blank') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    try {
      const targetUrl = new URL(link.href, window.location.origin);
      if (targetUrl.origin === window.location.origin && targetUrl.pathname !== window.location.pathname) {
        document.body.classList.add('page-is-exiting');
      }
    } catch (_) {}
  });
});

