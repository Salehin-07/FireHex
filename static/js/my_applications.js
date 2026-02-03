// ============================================
// MY APPLICATIONS PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initFilterButtons();
    initSortSelect();
    initCopyButtons();
    initFAB();
    initAnimations();
    initTooltips();
    initPaymentButtons();
    
    // ============================================
    // FILTER FUNCTIONALITY
    // ============================================
    function initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn-apps');
        const applicationCards = document.querySelectorAll('.application-card');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter cards
                applicationCards.forEach((card, index) => {
                    const status = card.getAttribute('data-status');
                    
                    if (filter === 'all' || status === filter) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ============================================
    // SORT FUNCTIONALITY
    // ============================================
    function initSortSelect() {
        const sortSelect = document.getElementById('sortApplications');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const grid = document.querySelector('.applications-grid');
            const cards = Array.from(document.querySelectorAll('.application-card'));
            
            // Sort cards
            cards.sort((a, b) => {
                if (sortBy === 'recent') {
                    return parseInt(b.getAttribute('data-date')) - parseInt(a.getAttribute('data-date'));
                } else if (sortBy === 'oldest') {
                    return parseInt(a.getAttribute('data-date')) - parseInt(b.getAttribute('data-date'));
                } else if (sortBy === 'tournament') {
                    return parseInt(a.getAttribute('data-tournament-date')) - parseInt(b.getAttribute('data-tournament-date'));
                }
                return 0;
            });
            
            // Re-append sorted cards with animation
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            });
            
            setTimeout(() => {
                cards.forEach((card, index) => {
                    grid.appendChild(card);
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }, 300);
        });
    }
    
    // ============================================
    // COPY CREDENTIALS FUNCTIONALITY
    // ============================================
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll('.btn-copy-cred');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const credentialsBox = this.closest('.credentials-section').querySelector('.credentials-box');
                const text = credentialsBox.textContent;
                
                navigator.clipboard.writeText(text).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.style.background = '#16a34a';
                    this.style.color = 'white';
                    this.style.borderColor = '#16a34a';
                    
                    showNotification('Credentials copied to clipboard!', 'success');
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.background = 'white';
                        this.style.color = 'var(--primary-color)';
                        this.style.borderColor = 'var(--primary-color)';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showNotification('Failed to copy credentials', 'error');
                });
            });
        });
    }
    
    // ============================================
    // FLOATING ACTION BUTTON (FAB)
    // ============================================
    function initFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        
        if (!fabMain || !fabMenu) return;
        
        let isOpen = false;
        
        fabMain.addEventListener('click', function() {
            isOpen = !isOpen;
            
            if (isOpen) {
                fabMenu.classList.add('active');
                this.style.transform = 'rotate(45deg)';
            } else {
                fabMenu.classList.remove('active');
                this.style.transform = 'rotate(0deg)';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.quick-actions-fab')) {
                fabMenu.classList.remove('active');
                fabMain.style.transform = 'rotate(0deg)';
                isOpen = false;
            }
        });
    }
    
    // ============================================
    // PAYMENT BUTTONS
    // ============================================
    function initPaymentButtons() {
        const payButtons = document.querySelectorAll('.btn-pay-now');
        
        payButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.application-card');
                const tournamentTitle = card.querySelector('.app-tournament-title').textContent;
                
                // Show payment modal or redirect
                showNotification(`Processing payment for: ${tournamentTitle}`, 'info');
                
                // Add loading state
                const originalHTML = this.innerHTML;
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Simulate payment process
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalHTML;
                    // In real app, this would redirect to payment gateway
                    window.location.href = '#payment';
                }, 1500);
            });
        });
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.app-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `app-notification notification-${type}`;
        
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
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            border: 2px solid ${color.border};
            max-width: 400px;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Close button
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
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.7';
        });
        
        // Auto remove after 4 seconds
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
    // SCROLL ANIMATIONS
    // ============================================
    function initAnimations() {
        const cards = document.querySelectorAll('.application-card');
        
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
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }
    
    // ============================================
    // TOOLTIPS
    // ============================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.style.position = 'relative';
            
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    z-index: 1000;
                    pointer-events: none;
                    white-space: nowrap;
                    bottom: calc(100% + 0.5rem);
                    left: 50%;
                    transform: translateX(-50%);
                    animation: fadeIn 0.2s ease;
                `;
                
                // Arrow
                const arrow = document.createElement('div');
                arrow.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid rgba(0, 0, 0, 0.9);
                `;
                tooltip.appendChild(arrow);
                
                this.appendChild(tooltip);
                this._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }
    
    // ============================================
    // ACTION BUTTONS
    // ============================================
    const shareButtons = document.querySelectorAll('.btn-action-icon[data-tooltip="Share"]');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.application-card');
            const title = card.querySelector('.app-tournament-title').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: `Check out my tournament application: ${title}`,
                    url: window.location.href
                }).catch(err => console.log('Share cancelled'));
            } else {
                showNotification('Share feature not supported in this browser', 'info');
            }
        });
    });
    
    const downloadButtons = document.querySelectorAll('.btn-action-icon[data-tooltip="Download"]');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Downloading application details...', 'info');
            // Implement download functionality
        });
    });
    
    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const firstFilterBtn = document.querySelector('.filter-btn-apps');
            if (firstFilterBtn) firstFilterBtn.focus();
        }
    });
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('My Applications page initialized successfully');
});