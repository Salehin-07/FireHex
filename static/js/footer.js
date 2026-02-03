// ============================================
// FOOTER FUNCTIONALITY
// ============================================

(function() {
    'use strict';
    
    // DOM Elements
    const footer = document.getElementById('mainFooter');
    const backToTopBtn = document.getElementById('backToTop');
    const newsletterForm = document.getElementById('newsletterForm');
    const formMessage = document.getElementById('formMessage');
    const currentYearSpan = document.getElementById('currentYear');
    const socialLinks = document.querySelectorAll('.social-link');
    const footerLinks = document.querySelectorAll('.footer-link');
    
    // ============================================
    // SET CURRENT YEAR
    // ============================================
    
    function setCurrentYear() {
        if (currentYearSpan) {
            const currentYear = new Date().getFullYear();
            currentYearSpan.textContent = currentYear;
        }
    }
    
    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    
    let scrollTimeout;
    function handleBackToTop() {
        if (!backToTopBtn) return;
        
        if (scrollTimeout) {
            return;
        }
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show/hide button based on scroll position
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            
            scrollTimeout = null;
        }, 50);
    }
    
    function scrollToTop(e) {
        if (e) e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Alternative fallback for older browsers
        if (window.pageYOffset > 0) {
            const scrollStep = -window.scrollY / (500 / 15);
            const scrollInterval = setInterval(() => {
                if (window.pageYOffset !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }
        
        // Add click animation
        if (backToTopBtn) {
            backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                backToTopBtn.style.transform = '';
            }, 150);
        }
    }
    
    // ============================================
    // NEWSLETTER FORM VALIDATION
    // ============================================
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
    
//    ============================================
//    NEWSLETTER FORM SUBMISSION
//    ============================================
//     
//     function handleNewsletterSubmit(e) {
//         e.preventDefault();
//         
//         const emailInput = newsletterForm.querySelector('input[name="email"]');
//         const email = emailInput.value.trim();
//         const submitBtn = newsletterForm.querySelector('.newsletter-btn');
//         
        //Validate email
//         if (!email) {
//             showMessage('Please enter your email address.', 'error');
//             emailInput.focus();
//             return;
//         }
//         
//         if (!isValidEmail(email)) {
//             showMessage('Please enter a valid email address.', 'error');
//             emailInput.focus();
//             return;
//         }
//         
        //Disable button and show loading state
//         submitBtn.disabled = true;
//         const originalHTML = submitBtn.innerHTML;
//         submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
//         
        //Get CSRF token
//         const csrfToken = newsletterForm.querySelector('[name="csrfmiddlewaretoken"]')?.value;
//         
        //Prepare form data
//         const formData = new FormData();
//         formData.append('email', email);
//         if (csrfToken) {
//             formData.append('csrfmiddlewaretoken', csrfToken);
//         }
//         
        //Submit to server (replace with your actual endpoint)
//         fetch('newsletter/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-Requested-With': 'XMLHttpRequest',
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
//                 emailInput.value = '';
//                 
                //Track subscription event (if analytics is available)
//                 if (typeof gtag !== 'undefined') {
//                     gtag('event', 'newsletter_signup', {
//                         'event_category': 'engagement',
//                         'event_label': 'footer_newsletter'
//                     });
//                 }
//             } else {
//                 showMessage(data.message || 'Something went wrong. Please try again.', 'error');
//             }
//         })
//         .catch(error => {
//             console.error('Newsletter subscription error:', error);
//             showMessage('Unable to subscribe at the moment. Please try again later.', 'error');
//         })
//         .finally(() => {
            //Re-enable button
//             submitBtn.disabled = false;
//             submitBtn.innerHTML = originalHTML;
//         });
//     }
    
    // ============================================
    // FOOTER LINK ANALYTICS
    // ============================================
    
    function trackFooterLink(e) {
        const link = e.currentTarget;
        const linkText = link.textContent.trim();
        const linkHref = link.getAttribute('href');
        
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'footer_navigation',
                'event_label': linkText,
                'value': linkHref
            });
        }
    }
    
    // ============================================
    // SOCIAL LINK ANALYTICS
    // ============================================
    
    function trackSocialClick(e) {
        const link = e.currentTarget;
        const platform = link.getAttribute('aria-label');
        
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                'event_category': 'social_media',
                'event_label': platform,
                'value': link.getAttribute('href')
            });
        }
    }
    
    // ============================================
    // FOOTER ANIMATION ON SCROLL
    // ============================================
    
    function animateFooterOnScroll() {
        if (!footer) return;
        
        const footerPosition = footer.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        // Trigger animation when footer is 20% visible
        if (footerPosition < screenHeight * 0.8) {
            footer.classList.add('in-view');
        }
    }
    
    // ============================================
    // INTERSECTION OBSERVER FOR FOOTER ANIMATIONS
    // ============================================
    
    function initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        // Observe footer columns
        const footerCols = document.querySelectorAll('.footer-col');
        footerCols.forEach(col => {
            footerObserver.observe(col);
        });
    }
    
    // ============================================
    // KEYBOARD NAVIGATION ENHANCEMENT
    // ============================================
    
    function enhanceKeyboardNavigation() {
        const focusableElements = footer.querySelectorAll(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                // Add visual feedback for keyboard users
                if (e.key === 'Enter' || e.key === ' ') {
                    element.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        element.style.transform = '';
                    }, 150);
                }
            });
        });
    }
    
    // ============================================
    // LAZY LOAD SOCIAL ICONS
    // ============================================
    
    function lazyLoadSocialIcons() {
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                // Add entrance animation
                icon.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    }
    
    // ============================================
    // EMAIL VALIDATION ON INPUT
    // ============================================
    
    function handleEmailInput(e) {
        const input = e.target;
        const email = input.value.trim();
        
        // Clear previous messages
        if (formMessage.classList.contains('error')) {
            formMessage.className = 'form-message';
        }
        
        // Real-time validation feedback
        if (email && !isValidEmail(email)) {
            input.style.borderColor = '#ef4444';
        } else if (email && isValidEmail(email)) {
            input.style.borderColor = '#22c55e';
        } else {
            input.style.borderColor = '';
        }
    }
    
    // ============================================
    // INITIALIZE EVENT LISTENERS
    // ============================================
    
    function init() {
        // Set current year
        setCurrentYear();
        
        // Back to top button - simple implementation
        if (backToTopBtn) {
            // Show/hide on scroll
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }, { passive: true });
            
            // Click handler
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            // Initial check
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            }
        }
        
        // Newsletter form
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
            
            const emailInput = newsletterForm.querySelector('input[name="email"]');
            if (emailInput) {
                emailInput.addEventListener('input', handleEmailInput);
                
                // Add focus animation
                emailInput.addEventListener('focus', () => {
                    emailInput.parentElement.style.transform = 'scale(1.02)';
                });
                
                emailInput.addEventListener('blur', () => {
                    emailInput.parentElement.style.transform = '';
                });
            }
        }
        
        // Track footer links
        footerLinks.forEach(link => {
            link.addEventListener('click', trackFooterLink);
        });
        
        // Track social links
        socialLinks.forEach(link => {
            link.addEventListener('click', trackSocialClick);
        });
        
        // Initialize intersection observer for animations
        initIntersectionObserver();
        
        // Enhance keyboard navigation
        enhanceKeyboardNavigation();
        
        // Lazy load social icons
        lazyLoadSocialIcons();
        
        // Footer animation on scroll (fallback for older browsers)
        window.addEventListener('scroll', animateFooterOnScroll, { passive: true });
    }
    
    // ============================================
    // UTILITY: DEBOUNCE FUNCTION
    // ============================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    window.footerAPI = {
        scrollToTop: scrollToTop,
        showMessage: showMessage,
        validateEmail: isValidEmail
    };
    
    // ============================================
    // START EVERYTHING
    // ============================================
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ============================================
    // ADDITIONAL ENHANCEMENTS
    // ============================================
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple effect to newsletter button
    const newsletterBtn = document.querySelector('.newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', createRipple);
    }
    
    // Add ripple CSS dynamically if not present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .newsletter-btn, .back-to-top {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
})();