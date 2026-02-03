/**
 * Login Form Interactions
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.auth-login-form');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn ? loginBtn.querySelector('.btn-text') : null;
    const spinner = document.getElementById('loading-spinner');
    const passwordToggle = document.getElementById('password-toggle');
    
    // 1. Password Visibility Toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            // Find the password input in the same group
            const passwordInput = this.closest('.auth-input-container').querySelector('input');
            const icon = this.querySelector('.toggle-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.textContent = '🙈';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                icon.textContent = '👁️';
                this.setAttribute('aria-label', 'Show password');
            }
            
            // Focus back on input for better UX
            passwordInput.focus();
        });
    }

    // 2. Handle Form Submission UI
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // Check if form is already submitting to prevent double clicks
            if (loginBtn.dataset.submitting === 'true') {
                e.preventDefault();
                return;
            }

            // Enter loading state
            loginBtn.dataset.submitting = 'true';
            loginBtn.style.opacity = '0.7';
            loginBtn.style.pointerEvents = 'none';
            
            if (spinner) spinner.style.display = 'inline-block';
            if (btnText) btnText.textContent = 'Signing in...';
            
            // Add a small fade out effect to the card for polish
            const card = document.querySelector('.auth-login-card');
            card.style.opacity = '0.95';
        });
    }

    // 3. Error Shake Effect
    const errorContainer = document.querySelector('.auth-form-errors');
    if (errorContainer) {
        errorContainer.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    }

    // 4. Input Focus Enhancements
    const allInputs = document.querySelectorAll('.auth-input-container input');
    allInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.auth-form-group').classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            input.closest('.auth-form-group').classList.remove('is-focused');
        });
    });
});
