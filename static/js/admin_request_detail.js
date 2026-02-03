// ============================================
// ADMIN REQUEST DETAIL PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initCopyButtons();
    //initPaymentForm();
    initNotesForm();
    initQuickActions();
    initAnimations();
    
    // ============================================
    // COPY TO CLIPBOARD
    // ============================================
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll('.btn-copy-detail');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-copy');
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.style.borderColor = '#16a34a';
                    this.style.color = '#16a34a';
                    
                    showNotification('Copied to clipboard!', 'success');
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.borderColor = '';
                        this.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showNotification('Failed to copy to clipboard', 'error');
                });
            });
        });
    }
    
    // ============================================
    // PAYMENT FORM
    // ============================================
    function initPaymentForm() {
        const paymentForm = document.getElementById('paymentForm');
        
        if (paymentForm) {
            paymentForm.addEventListener('submit', function(e) {
                const action = e.submitter.value;
                const actionText = action === 'mark_paid' ? 'paid' : 'unpaid';
                
                const confirmed = confirm(`Are you sure you want to mark this request as ${actionText}?`);
                
                if (!confirmed) {
                    e.preventDefault();
                    return false;
                }
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Show loading notification
                showNotification('Updating payment status...', 'info');
                
                // Let the form submit naturally
            });
        }
    }
    
    // ============================================
    // NOTES FORM
    // ============================================
    function initNotesForm() {
        const notesForm = document.getElementById('notesForm');
        
        if (notesForm) {
            notesForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const textarea = this.querySelector('textarea[name="note"]');
                const noteText = textarea.value.trim();
                
                if (!noteText) {
                    showNotification('Please enter a note', 'error');
                    textarea.focus();
                    return;
                }
                
                const submitBtn = this.querySelector('.btn-save-note');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                
                showNotification('Saving note...', 'info');
                
                // Simulate API call
                setTimeout(() => {
                    // Add new note to the list
                    addNoteToList(noteText);
                    
                    // Reset form
                    textarea.value = '';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Note';
                    
                    showNotification('Note saved successfully!', 'success');
                }, 1000);
            });
        }
    }
    
    function addNoteToList(noteText) {
        const notesList = document.querySelector('.notes-list');
        
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.style.opacity = '0';
        noteItem.style.transform = 'translateY(-10px)';
        noteItem.innerHTML = `
            <div class="note-header">
                <span class="note-author">Admin</span>
                <span class="note-date">Just now</span>
            </div>
            <p class="note-content">${noteText}</p>
        `;
        
        // Insert at the beginning
        notesList.insertBefore(noteItem, notesList.firstChild);
        
        // Animate in
        setTimeout(() => {
            noteItem.style.transition = 'all 0.3s ease';
            noteItem.style.opacity = '1';
            noteItem.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // ============================================
    // QUICK ACTIONS
    // ============================================
    function initQuickActions() {
        const sendEmailBtn = document.getElementById('sendEmailBtn');
        const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');
        const deleteRequestBtn = document.getElementById('deleteRequestBtn');
        
        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', function() {
                showNotification('Email composition feature coming soon!', 'info');
                // Implement email sending functionality
            });
        }
        
        if (sendWhatsAppBtn) {
            sendWhatsAppBtn.addEventListener('click', function() {
                const whatsappNumber = document.querySelector('.whatsapp-value').textContent.trim();
                const whatsappUrl = `https://wa.me/${whatsappNumber}`;
                window.open(whatsappUrl, '_blank');
            });
        }
        
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', function() {
                showHistoryModal();
            });
        }
        
        if (deleteRequestBtn) {
            deleteRequestBtn.addEventListener('click', function() {
                const confirmed = confirm('Are you sure you want to delete this request? This action cannot be undone.');
                
                if (confirmed) {
                    showNotification('Deleting request...', 'info');
                    
                    setTimeout(() => {
                        showNotification('Request deleted successfully', 'success');
                        // Redirect to admin requests page
                        setTimeout(() => {
                            window.location.href = document.querySelector('.breadcrumb-link-admin').href;
                        }, 1000);
                    }, 800);
                }
            });
        }
    }
    
    function showHistoryModal() {
        const modal = document.createElement('div');
        modal.className = 'history-modal-overlay';
        modal.innerHTML = `
            <div class="history-modal">
                <div class="history-modal-header">
                    <h2>Request History</h2>
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="history-modal-body">
                    <div class="history-timeline">
                        <div class="history-item">
                            <div class="history-icon history-create">
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            <div class="history-content">
                                <p class="history-title">Request Created</p>
                                <p class="history-description">User submitted tournament join request</p>
                                <span class="history-time">3 days ago</span>
                            </div>
                        </div>
                        <div class="history-item">
                            <div class="history-icon history-update">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="history-content">
                                <p class="history-title">Status Updated</p>
                                <p class="history-description">Payment status changed to: Pending</p>
                                <span class="history-time">2 days ago</span>
                            </div>
                        </div>
                        <div class="history-item">
                            <div class="history-icon history-note">
                                <i class="fas fa-sticky-note"></i>
                            </div>
                            <div class="history-content">
                                <p class="history-title">Note Added</p>
                                <p class="history-description">Admin added note about payment verification</p>
                                <span class="history-time">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        addModalStyles();
        
        const closeBtn = modal.querySelector('.modal-close-btn');
        closeBtn.addEventListener('click', () => closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }
    
    function closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    function addModalStyles() {
        if (document.getElementById('modal-styles-detail')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles-detail';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .history-modal {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .history-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid var(--border-color);
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            
            .history-modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: var(--text-dark);
            }
            
            .modal-close-btn {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                border: none;
                background: white;
                color: var(--text-dark);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-close-btn:hover {
                background: var(--bg-light);
                color: var(--primary-color);
            }
            
            .history-modal-body {
                padding: 2rem;
            }
            
            .history-timeline {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .history-item {
                display: flex;
                gap: 1rem;
            }
            
            .history-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .history-create {
                background: rgba(99, 102, 241, 0.1);
                color: var(--primary-color);
            }
            
            .history-update {
                background: rgba(245, 158, 11, 0.1);
                color: #f59e0b;
            }
            
            .history-note {
                background: rgba(34, 197, 94, 0.1);
                color: #16a34a;
            }
            
            .history-content {
                flex: 1;
            }
            
            .history-title {
                font-weight: 700;
                color: var(--text-dark);
                margin: 0 0 0.5rem 0;
                font-size: 1rem;
            }
            
            .history-description {
                font-size: 0.9rem;
                color: var(--text-light);
                margin: 0 0 0.5rem 0;
                line-height: 1.5;
            }
            
            .history-time {
                font-size: 0.85rem;
                color: var(--text-light);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.detail-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `detail-notification notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        const colors = {
            success: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
            error: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
            info: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: calc(var(--nav-height) + 1rem);
            right: 1rem;
            background: ${color.bg};
            color: ${color.text};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            border: 2px solid ${color.border};
            max-width: 400px;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 1rem;
            padding: 0;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // ANIMATIONS
    // ============================================
    function initAnimations() {
        const cards = document.querySelectorAll('.detail-card-admin, .sidebar-card-admin-detail');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }
    
    // ============================================
    // CONFIRM BEFORE LEAVING
    // ============================================
    const textarea = document.querySelector('.form-textarea-admin-detail');
    let hasUnsavedChanges = false;
    
    if (textarea) {
        textarea.addEventListener('input', function() {
            hasUnsavedChanges = this.value.trim().length > 0;
        });
        
        window.addEventListener('beforeunload', function(e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        
        document.getElementById('notesForm')?.addEventListener('submit', function() {
            hasUnsavedChanges = false;
        });
    }
    
    console.log('Admin request detail page initialized successfully');
});