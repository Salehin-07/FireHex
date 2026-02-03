// ============================================
// TOURNAMENT DETAIL PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initFormValidation();
    initAnimations();
    initStickyElements();
    initTooltips();
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    function initFormValidation() {
        const joinForm = document.getElementById('joinForm');
        if (!joinForm) return;
        
        const whatsappInput = joinForm.querySelector('input[name="whatsapp_number"]');
        const profileInput = joinForm.querySelector('input[name="social_profile_url"]');
        const submitBtn = joinForm.querySelector('.btn-join-submit');
        
        // Real-time WhatsApp validation
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function(e) {
                validateWhatsApp(e.target);
            });
            
            whatsappInput.addEventListener('blur', function(e) {
                validateWhatsApp(e.target);
            });
        }
        
        // Real-time URL validation
        if (profileInput) {
            profileInput.addEventListener('input', function(e) {
                validateURL(e.target);
            });
            
            profileInput.addEventListener('blur', function(e) {
                validateURL(e.target);
            });
        }
        
        // Form submission
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';
            const profileValue = profileInput ? profileInput.value.trim() : '';
            
            // Validate WhatsApp
            if (!validateWhatsAppNumber(whatsappValue)) {
                showNotification('Please enter a valid WhatsApp number with country code (e.g., +8801234567890)', 'error');
                whatsappInput.focus();
                return false;
            }
            
            // Validate URL
            if (!validateProfileURL(profileValue)) {
                showNotification('Please enter a valid profile URL (e.g., https://facebook.com/username)', 'error');
                profileInput.focus();
                return false;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Submitting...</span>';
            
            // Submit form
            setTimeout(() => {
                this.submit();
            }, 300);
        });
    }
    
    // WhatsApp validation
    function validateWhatsApp(input) {
        const value = input.value.trim();
        const isValid = validateWhatsAppNumber(value);
        
        if (value && !isValid) {
            input.style.borderColor = '#ef4444';
            showInputError(input, 'Invalid WhatsApp number format');
        } else {
            input.style.borderColor = isValid ? '#16a34a' : '';
            removeInputError(input);
        }
        
        return isValid;
    }
    
    function validateWhatsAppNumber(number) {
        if (!number) return false;
        
        // Remove all non-digit characters
        const cleaned = number.replace(/\D/g, '');
        
        // Must have at least 9 digits (country code + number)
        if (cleaned.length < 9) return false;
        
        // Must start with + or a digit
        if (number[0] !== '+' && isNaN(number[0])) return false;
        
        return true;
    }
    
    // URL validation
    function validateURL(input) {
        const value = input.value.trim();
        const isValid = validateProfileURL(value);
        
        if (value && !isValid) {
            input.style.borderColor = '#ef4444';
            showInputError(input, 'Enter a valid URL (https://...)');
        } else {
            input.style.borderColor = isValid ? '#16a34a' : '';
            removeInputError(input);
        }
        
        return isValid;
    }
    
    function validateProfileURL(url) {
        if (!url) return false;
        
        try {
            const urlObj = new URL(url);
            // Check if it's http or https
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (err) {
            return false;
        }
    }
    
    // Show input error
    function showInputError(input, message) {
        removeInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorDiv.prepend(icon);
        
        input.parentElement.appendChild(errorDiv);
    }
    
    // Remove input error
    function removeInputError(input) {
        const existingError = input.parentElement.querySelector('.input-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.detail-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `detail-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: calc(var(--nav-height) + 1rem);
            right: 1rem;
            background: ${type === 'error' ? '#fee2e2' : '#dcfce7'};
            color: ${type === 'error' ? '#dc2626' : '#16a34a'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            border: 2px solid ${type === 'error' ? '#fca5a5' : '#86efac'};
            max-width: 400px;
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
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
        
        .notification-close:hover {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initAnimations() {
        const cards = document.querySelectorAll('.detail-card, .join-card, .login-prompt-card');
        
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
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
    
    // ============================================
    // STICKY ELEMENTS
    // ============================================
    function initStickyElements() {
        const sidebar = document.querySelector('.join-card');
        if (!sidebar) return;
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow on scroll
            if (scrollTop > 100) {
                sidebar.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            } else {
                sidebar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ============================================
    // COPY TO CLIPBOARD (for credentials)
    // ============================================
    const credentialsContent = document.querySelector('.credentials-content');
    if (credentialsContent) {
        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy-credentials';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Credentials';
        copyBtn.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        credentialsContent.parentElement.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', function() {
            const text = credentialsContent.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = '#16a34a';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Copy Credentials';
                    this.style.background = 'var(--primary-color)';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy credentials', 'error');
            });
        });
        
        copyBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        });
        
        copyBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }
    
    // ============================================
    // TOOLTIPS
    // ============================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.style.position = 'relative';
            element.style.cursor = 'help';
            
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
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-bottom: 0.5rem;
                `;
                
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
    
    // ============================================
    // COUNTDOWN TIMER (Optional)
    // ============================================
    function initCountdown() {
        const metaBar = document.querySelector('.tournament-meta-bar');
        const startDateElement = metaBar?.querySelector('.meta-item:first-child span');
        
        if (startDateElement) {
            // This would require the actual date/time from the backend
            // Placeholder for countdown functionality
            console.log('Countdown timer ready for implementation');
        }
    }
    
    console.log('Tournament detail page initialized successfully');
});