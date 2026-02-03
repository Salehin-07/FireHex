// Credentials Update JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Form elements
  const form = document.querySelector('.credentials-update-form');
  const saveButton = document.querySelector('.btn-save-credentials');
  const formInputs = form.querySelectorAll('input, textarea, select');
  
  // Add loading state to save button
  if (form && saveButton) {
    form.addEventListener('submit', function() {
      saveButton.disabled = true;
      saveButton.innerHTML = '<span class="btn-icon">⏳</span> Saving...';
      saveButton.style.opacity = '0.7';
    });
  }
  
  // Add real-time validation and visual feedback
  formInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      validateField(this);
    });
    
    // Add input effects for real-time validation
    if (input.type !== 'password') {
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          this.parentElement.classList.add('has-value');
        } else {
          this.parentElement.classList.remove('has-value');
        }
      });
    }
  });
  
  // Field validation function
  function validateField(field) {
    const fieldGroup = field.closest('.form-field-group');
    const errorContainer = fieldGroup.querySelector('.form-field-errors');
    
    // Clear previous errors
    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      showFieldError(fieldGroup, 'This field is required');
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        showFieldError(fieldGroup, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Password strength validation (if it's a password field)
    if (field.type === 'password' && field.value.trim()) {
      if (field.value.length < 8) {
        showFieldError(fieldGroup, 'Password should be at least 8 characters long');
        return false;
      }
    }
    
    // If we passed all validations
    fieldGroup.classList.remove('has-error');
    fieldGroup.classList.add('has-success');
    
    return true;
  }
  
  // Show error message
  function showFieldError(fieldGroup, message) {
    fieldGroup.classList.add('has-error');
    fieldGroup.classList.remove('has-success');
    
    let errorContainer = fieldGroup.querySelector('.form-field-errors');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'form-field-errors';
      fieldGroup.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `<span class="error-message">${message}</span>`;
  }
  
  // Add CSS for validation states
  const style = document.createElement('style');
  style.textContent = `
    .form-field-group.focused .form-field-input input,
    .form-field-group.focused .form-field-input textarea,
    .form-field-group.focused .form-field-input select {
      border-color: #4a90e2;
      background-color: #ffffff;
    }
    
    .form-field-group.has-error .form-field-input input,
    .form-field-group.has-error .form-field-input textarea,
    .form-field-group.has-error .form-field-input select {
      border-color: #e74c3c;
      background-color: #fdf2f2;
    }
    
    .form-field-group.has-success .form-field-input input,
    .form-field-group.has-success .form-field-input textarea,
    .form-field-group.has-success .form-field-input select {
      border-color: #2ecc71;
      background-color: #f0f9f4;
    }
    
    .form-field-group.has-value .form-field-input input,
    .form-field-group.has-value .form-field-input textarea,
    .form-field-group.has-value .form-field-input select {
      background-color: #f8fdf8;
    }
  `;
  document.head.appendChild(style);
});