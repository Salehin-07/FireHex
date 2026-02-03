// Auth Signup JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const signupForm = document.querySelector('.auth-signup-form');
  const signupBtn = document.getElementById('signup-btn');
  const passwordToggles = document.querySelectorAll('.auth-password-toggle');
  const termsCheckbox = document.querySelector('input[name="terms_agree"]');
  
  // Password visibility toggle
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (passwordInput) {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const toggleIcon = this.querySelector('.toggle-icon');
        toggleIcon.textContent = isPassword ? '🔒' : '👁️';
        
        // Add animation
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
  
  // Form submission with loading state
  if (signupForm && signupBtn) {
    signupForm.addEventListener('submit', function(e) {
      // Check terms agreement
      if (termsCheckbox && !termsCheckbox.checked) {
        e.preventDefault();
        showTermsError();
        return;
      }
      
      // Basic validation
      const inputs = this.querySelectorAll('input[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          showFieldError(input, 'This field is required');
        } else {
          clearFieldError(input);
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        // Shake animation for errors
        signupForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          signupForm.style.animation = '';
        }, 500);
        return;
      }
      
      // Show loading state
      signupBtn.classList.add('loading');
      signupBtn.disabled = true;
      signupBtn.querySelector('.btn-text').textContent = 'Creating Account...';
      
      // Simulate network delay for demo (remove in production)
      setTimeout(() => {
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
        signupBtn.querySelector('.btn-text').textContent = 'Create Account';
      }, 2000);
    });
  }
  
  // Real-time validation and focus management
  const formInputs = signupForm?.querySelectorAll('input, select, textarea');
  formInputs?.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', function() {
      // Remove focus from all other inputs
      formInputs.forEach(otherInput => {
        if (otherInput !== this) {
          otherInput.parentElement.classList.remove('focused');
        }
      });
      
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      validateField(this);
    });
    
    // Real-time validation for specific fields
    if (input.type === 'email') {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          validateEmail(this);
        }
      });
    }
    
    if (input.type === 'password') {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          validatePassword(this);
        }
      });
    }
  });
  
  // Terms agreement error
  function showTermsError() {
    const termsLabel = document.querySelector('.auth-terms-agree');
    if (!termsLabel.querySelector('.terms-error')) {
      const errorElement = document.createElement('div');
      errorElement.className = 'terms-error auth-error-text';
      errorElement.textContent = 'You must agree to the terms and conditions';
      errorElement.style.marginTop = '0.5rem';
      termsLabel.appendChild(errorElement);
      
      // Shake animation
      termsLabel.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        termsLabel.style.animation = '';
      }, 500);
    }
  }
  
  // Field validation
  function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      showFieldError(field, 'This field is required');
      return false;
    }
    
    clearFieldError(field);
    return true;
  }
  
  function validateEmail(emailField) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      showFieldError(emailField, 'Please enter a valid email address');
      return false;
    }
    clearFieldError(emailField);
    return true;
  }
  
  function validatePassword(passwordField) {
    const password = passwordField.value;
    
    // Clear previous strength indicators
    clearPasswordStrength(passwordField);
    
    if (password.length < 8) {
      showFieldError(passwordField, 'Password must be at least 8 characters long');
      return false;
    }
    
    // Check password strength
    const strength = calculatePasswordStrength(password);
    showPasswordStrength(passwordField, strength);
    
    clearFieldError(passwordField);
    return true;
  }
  
  function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return strength;
  }
  
  function showPasswordStrength(field, strength) {
    const strengthContainer = document.createElement('div');
    strengthContainer.className = 'password-strength';
    
    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';
    
    const strengthFill = document.createElement('div');
    strengthFill.className = 'strength-fill';
    
    const strengthText = document.createElement('div');
    strengthText.className = 'strength-text';
    
    if (strength <= 3) {
      strengthFill.classList.add('strength-weak');
      strengthText.textContent = 'Weak password';
    } else if (strength <= 5) {
      strengthFill.classList.add('strength-medium');
      strengthText.textContent = 'Medium strength password';
    } else {
      strengthFill.classList.add('strength-strong');
      strengthText.textContent = 'Strong password';
    }
    
    strengthBar.appendChild(strengthFill);
    strengthContainer.appendChild(strengthBar);
    strengthContainer.appendChild(strengthText);
    
    field.parentElement.appendChild(strengthContainer);
  }
  
  function clearPasswordStrength(field) {
    const existingStrength = field.parentElement.querySelector('.password-strength');
    if (existingStrength) {
      existingStrength.remove();
    }
  }
  
  function showFieldError(input, message) {
    const formGroup = input.closest('.auth-form-group');
    formGroup.classList.add('has-error');
    
    let errorContainer = formGroup.querySelector('.auth-field-errors');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'auth-field-errors';
      formGroup.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `<span class="auth-error-text">${message}</span>`;
    
    // Add shake animation to the specific field
    formGroup.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      formGroup.style.animation = '';
    }, 500);
  }
  
  function clearFieldError(input) {
    const formGroup = input.closest('.auth-form-group');
    formGroup.classList.remove('has-error');
    
    const errorContainer = formGroup.querySelector('.auth-field-errors');
    if (errorContainer) {
      errorContainer.remove();
    }
  }
  
  // Add floating particles for background
  createFloatingParticles();
  
  function createFloatingParticles() {
    const container = document.querySelector('.auth-signup-container');
    const particles = 20;
    
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }
    
    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
      @keyframes floatParticle {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(particleStyle);
  }
  
  // Remove terms error when checkbox is checked
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function() {
      const termsError = document.querySelector('.terms-error');
      if (termsError && this.checked) {
        termsError.remove();
      }
    });
  }
});