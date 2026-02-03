// ============================================
// PROFILE PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initAvatarUpload();
    initEditProfile();
    initPasswordChange();
    initToggleSwitches();
    initLogoutConfirmation();
    initAnimations();
    initHelpButton();
    
    // ============================================
    // AVATAR UPLOAD
    // ============================================
    function initAvatarUpload() {
        const avatarEditBtn = document.querySelector('.avatar-edit-btn');
        
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', function() {
                // Create file input dynamically
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                
                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > 5 * 1024 * 1024) { // 5MB limit
                            showNotification('Image size should be less than 5MB', 'error');
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            const avatar = document.querySelector('.profile-avatar');
                            avatar.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                            showNotification('Avatar updated successfully!', 'success');
                            
                            // Here you would typically upload to server
                            // uploadAvatar(file);
                        };
                        reader.readAsDataURL(file);
                    }
                });
                
                fileInput.click();
            });
        }
    }
    
    // ============================================
    // EDIT PROFILE
    // ============================================
    function initEditProfile() {
        const editButtons = document.querySelectorAll('.btn-edit-profile, #editProfileBtn');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                showEditModal();
            });
        });
    }
    
    function showEditModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'profile-modal-overlay';
        modal.innerHTML = `
            <div class="profile-modal">
                <div class="profile-modal-header">
                    <h2>Edit Profile</h2>
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="profile-modal-body">
                    <form id="editProfileForm">
                        <div class="form-group-profile">
                            <label>
                                <i class="fas fa-user"></i> Username
                            </label>
                            <input type="text" name="username" value="${document.querySelector('.profile-username').textContent}" class="form-input-profile">
                        </div>
                        
                        <div class="form-group-profile">
                            <label>
                                <i class="fas fa-envelope"></i> Email
                            </label>
                            <input type="email" name="email" value="${document.querySelector('.profile-email').textContent}" class="form-input-profile">
                        </div>
                        
                        <div class="form-group-profile">
                            <label>
                                <i class="fab fa-whatsapp"></i> WhatsApp Number
                            </label>
                            <input type="tel" name="whatsapp" placeholder="+880..." class="form-input-profile">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-cancel-modal">Cancel</button>
                            <button type="submit" class="btn-save-modal">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add styles
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
        
        // Add modal styles
        addModalStyles();
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = modal.querySelector('.btn-cancel-modal');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
        
        // Form submission
        const form = modal.querySelector('#editProfileForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading
            const submitBtn = form.querySelector('.btn-save-modal');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Profile updated successfully!', 'success');
                closeModal(modal);
                
                // Update UI
                document.querySelector('.profile-username').textContent = data.username;
                document.querySelector('.profile-email').textContent = data.email;
            }, 1000);
        });
    }
    
    // ============================================
    // CHANGE PASSWORD
    // ============================================
    function initPasswordChange() {
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                showPasswordModal();
            });
        }
    }
    
    function showPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'profile-modal-overlay';
        modal.innerHTML = `
            <div class="profile-modal">
                <div class="profile-modal-header">
                    <h2>Change Password</h2>
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="profile-modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group-profile">
                            <label>
                                <i class="fas fa-lock"></i> Current Password
                            </label>
                            <input type="password" name="current_password" required class="form-input-profile">
                        </div>
                        
                        <div class="form-group-profile">
                            <label>
                                <i class="fas fa-key"></i> New Password
                            </label>
                            <input type="password" name="new_password" required class="form-input-profile">
                        </div>
                        
                        <div class="form-group-profile">
                            <label>
                                <i class="fas fa-check"></i> Confirm New Password
                            </label>
                            <input type="password" name="confirm_password" required class="form-input-profile">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-cancel-modal">Cancel</button>
                            <button type="submit" class="btn-save-modal">
                                <i class="fas fa-key"></i> Change Password
                            </button>
                        </div>
                    </form>
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
        const cancelBtn = modal.querySelector('.btn-cancel-modal');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
        
        const form = modal.querySelector('#changePasswordForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const newPassword = formData.get('new_password');
            const confirmPassword = formData.get('confirm_password');
            
            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }
            
            const submitBtn = form.querySelector('.btn-save-modal');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changing...';
            
            setTimeout(() => {
                showNotification('Password changed successfully!', 'success');
                closeModal(modal);
            }, 1000);
        });
    }
    
    // ============================================
    // TOGGLE SWITCHES
    // ============================================
    function initToggleSwitches() {
        const toggles = document.querySelectorAll('.toggle-switch input');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const settingName = this.closest('.setting-item').querySelector('.setting-info span').textContent;
                const status = this.checked ? 'enabled' : 'disabled';
                
                showNotification(`${settingName} ${status}`, 'success');
                
                // Here you would save to backend
                // saveSettings(settingName, this.checked);
            });
        });
    }
    
    // ============================================
    // LOGOUT CONFIRMATION
    // ============================================
    function initLogoutConfirmation() {
        const logoutForm = document.getElementById('logoutForm');
        
        if (logoutForm) {
            logoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const confirmed = confirm('Are you sure you want to logout?');
                if (confirmed) {
                    const btn = this.querySelector('.btn-logout');
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Logging out...</span>';
                    
                    setTimeout(() => {
                        this.submit();
                    }, 500);
                }
            });
        }
    }
    
    // ============================================
    // HELP BUTTON
    // ============================================
    function initHelpButton() {
        const helpBtn = document.querySelector('.btn-help-profile');
        
        if (helpBtn) {
            helpBtn.addEventListener('click', function() {
                showNotification('Support team will contact you shortly!', 'info');
                // Redirect to support page or open chat
            });
        }
    }
    
    // ============================================
    // MODAL HELPER FUNCTIONS
    // ============================================
    function closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    function addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .profile-modal {
                background: white;
                border-radius: 16px;
                max-width: 500px;
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
            
            .profile-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid var(--border-color);
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            
            .profile-modal-header h2 {
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
            
            .profile-modal-body {
                padding: 2rem;
            }
            
            .form-group-profile {
                margin-bottom: 1.5rem;
            }
            
            .form-group-profile label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                color: var(--text-dark);
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            
            .form-group-profile label i {
                color: var(--primary-color);
            }
            
            .form-input-profile {
                width: 100%;
                padding: 0.9rem 1.2rem;
                border: 2px solid var(--border-color);
                border-radius: 10px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .form-input-profile:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
            }
            
            .form-actions {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .btn-cancel-modal,
            .btn-save-modal {
                flex: 1;
                padding: 0.9rem 1.5rem;
                border-radius: 10px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .btn-cancel-modal {
                background: var(--bg-light);
                color: var(--text-dark);
            }
            
            .btn-cancel-modal:hover {
                background: #e2e8f0;
            }
            
            .btn-save-modal {
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }
            
            .btn-save-modal:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.profile-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `profile-notification notification-${type}`;
        
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
    
    // ============================================
    // ANIMATIONS
    // ============================================
    function initAnimations() {
        const cards = document.querySelectorAll('.stat-card-profile, .profile-info-card, .sidebar-card-profile');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
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
    
    console.log('Profile page initialized successfully');
});