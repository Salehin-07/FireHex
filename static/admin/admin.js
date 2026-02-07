/**
 * Fure Hex Admin Interface JavaScript
 * Enhanced functionality for the admin dashboard
 */

class LIEASAdmin {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeComponents();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        this.setupSidebar();
        this.setupCards();
        this.setupForms();
        this.setupTables();
        this.setupAlerts();
        this.setupAnimations();
        this.setupTheme();
    }

    setupEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Escape key handler
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    setupSidebar() {
        const sidebar = document.querySelector('.main-sidebar');
        const navLinks = document.querySelectorAll('.nav-sidebar .nav-link');
        
        // Set active nav item based on current page
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                link.classList.add('active');
            }
        });

        // Add click handlers for nav items
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Add loading animation
                this.showNavLoading(link);
            });
        });
    }

    setupCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupForms() {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('.form-control');
        
        // Enhanced form validation
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });

        // Input focus effects
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                this.validateField(input);
            });
        });
    }

    setupTables() {
        const tables = document.querySelectorAll('.table');
        
        tables.forEach(table => {
            // Add sorting functionality
            this.makeSortable(table);
            
            // Add row selection
            this.addRowSelection(table);
            
            // Add search functionality
            this.addTableSearch(table);
        });
    }

    setupAlerts() {
        const alerts = document.querySelectorAll('.alert');
        
        alerts.forEach(alert => {
            // Auto-dismiss alerts after 5 seconds
            setTimeout(() => {
                this.dismissAlert(alert);
            }, 5000);
            
            // Add close button if not present
            if (!alert.querySelector('.alert-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'alert-close';
                closeBtn.innerHTML = '×';
                closeBtn.addEventListener('click', () => this.dismissAlert(alert));
                alert.appendChild(closeBtn);
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all cards and content sections
        document.querySelectorAll('.card, .content-header').forEach(el => {
            observer.observe(el);
        });
    }

    setupTheme() {
        // Theme toggle functionality
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Apply saved theme
        const savedTheme = localStorage.getItem('lieas-theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }
    }

    // Utility Methods
    toggleSidebar() {
        const sidebar = document.querySelector('.main-sidebar');
        const contentWrapper = document.querySelector('.content-wrapper');
        
        sidebar.classList.toggle('collapsed');
        contentWrapper.classList.toggle('expanded');
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('lieas-theme', newTheme);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('.form-control[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');
        let isValid = true;
        
        // Clear previous errors
        this.clearFieldError(input);
        
        if (isRequired && !value) {
            this.showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(input, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        input.parentElement.appendChild(errorElement);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    makeSortable(table) {
        const headers = table.querySelectorAll('th');
        
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                this.sortTable(table, index);
            });
        });
    }

    sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            if (!isNaN(aValue) && !isNaN(bValue)) {
                return parseFloat(aValue) - parseFloat(bValue);
            }
            
            return aValue.localeCompare(bValue);
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    addRowSelection(table) {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            row.addEventListener('click', () => {
                row.classList.toggle('selected');
                this.updateBulkActions();
            });
        });
    }

    addTableSearch(table) {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search table...';
        searchInput.className = 'table-search form-control';
        
        const tableContainer = table.closest('.table-responsive');
        if (tableContainer) {
            tableContainer.insertBefore(searchInput, table);
        }
        
        searchInput.addEventListener('input', (e) => {
            this.filterTable(table, e.target.value);
        });
    }

    filterTable(table, searchTerm) {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    updateBulkActions() {
        const selectedRows = document.querySelectorAll('tr.selected');
        const bulkActions = document.querySelector('.bulk-actions');
        
        if (bulkActions) {
            bulkActions.style.display = selectedRows.length > 0 ? 'block' : 'none';
        }
    }

    showNavLoading(link) {
        const icon = link.querySelector('.nav-icon');
        if (icon) {
            icon.classList.add('loading');
            setTimeout(() => {
                icon.classList.remove('loading');
            }, 1000);
        }
    }

    dismissAlert(alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }

    handleResize() {
        const isMobile = window.innerWidth < 768;
        const sidebar = document.querySelector('.main-sidebar');
        const contentWrapper = document.querySelector('.content-wrapper');
        
        if (isMobile) {
            sidebar.classList.add('mobile');
            contentWrapper.classList.add('mobile');
        } else {
            sidebar.classList.remove('mobile');
            contentWrapper.classList.remove('mobile');
        }
    }

    handleKeydown(e) {
        // Close modals on Escape key
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                this.closeModal(modal);
            });
        }
    }

    // Modal functionality
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    // AJAX utilities
    async makeRequest(url, options = {}) {
        const defaults = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            }
        };
        
        const config = { ...defaults, ...options };
        
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            this.showNotification('Request failed. Please try again.', 'error');
            throw error;
        }
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    // Data management
    async refreshData(endpoint) {
        try {
            const data = await this.makeRequest(endpoint);
            this.updateUI(data);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }

    updateUI(data) {
        // Update UI elements based on received data
        // This can be customized based on your specific needs
        console.log('Updating UI with data:', data);
    }

    // Performance optimization
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Initialize components
    initializeComponents() {
        // Initialize date pickers
        this.initDatePickers();
        
        // Initialize rich text editors
        this.initRichTextEditors();
        
        // Initialize file uploads
        this.initFileUploads();
    }

    initDatePickers() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                console.log('Date changed:', e.target.value);
            });
        });
    }

    initRichTextEditors() {
        const textareas = document.querySelectorAll('textarea.rich-text');
        textareas.forEach(textarea => {
            // Initialize rich text editor here
            // This would typically use a library like TinyMCE or CKEditor
            console.log('Initializing rich text editor for:', textarea.id);
        });
    }

    initFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            // Handle file upload logic here
        }
    }
}

// Initialize the admin interface
const lieasAdmin = new LIEASAdmin();

// Export for use in other scripts
window.LIEASAdmin = lieasAdmin;