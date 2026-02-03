// ============================================
// ADMIN REQUESTS PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initSearch();
    initFilters();
    initSort();
    initCheckboxes();
    initBulkActions();
    initActionButtons();
    initExport();
    initQuickStats();
    initAnimations();
    
    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    function initSearch() {
        const searchInput = document.getElementById('searchRequests');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterTable(searchTerm);
        });
    }
    
    function filterTable(searchTerm) {
        const rows = document.querySelectorAll('.table-row-admin');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const tournament = row.getAttribute('data-tournament') || '';
            const user = row.getAttribute('data-user') || '';
            const whatsapp = row.getAttribute('data-whatsapp') || '';
            
            const matches = tournament.includes(searchTerm) || 
                          user.includes(searchTerm) || 
                          whatsapp.includes(searchTerm);
            
            if (matches) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        updateEmptyState(visibleCount);
    }
    
    // ============================================
    // FILTER FUNCTIONALITY
    // ============================================
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn-admin');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                applyFilter(filter);
            });
        });
    }
    
    function applyFilter(filter) {
        const rows = document.querySelectorAll('.table-row-admin');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const status = row.getAttribute('data-status');
            
            if (filter === 'all' || status === filter) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        updateEmptyState(visibleCount);
    }
    
    // ============================================
    // SORT FUNCTIONALITY
    // ============================================
    function initSort() {
        const sortSelect = document.getElementById('sortRequests');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortTable(sortBy);
        });
    }
    
    function sortTable(sortBy) {
        const tbody = document.querySelector('.admin-table tbody');
        const rows = Array.from(document.querySelectorAll('.table-row-admin'));
        
        rows.sort((a, b) => {
            if (sortBy === 'tournament') {
                const tournamentA = a.getAttribute('data-tournament');
                const tournamentB = b.getAttribute('data-tournament');
                return tournamentA.localeCompare(tournamentB);
            }
            // Add more sort options as needed
            return 0;
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }
    
    // ============================================
    // CHECKBOX FUNCTIONALITY
    // ============================================
    function initCheckboxes() {
        const selectAll = document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                rowCheckboxes.forEach(checkbox => {
                    const row = checkbox.closest('.table-row-admin');
                    if (row.style.display !== 'none') {
                        checkbox.checked = this.checked;
                    }
                });
                updateBulkActionsBar();
            });
        }
        
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateBulkActionsBar();
                updateSelectAllState();
            });
        });
    }
    
    function updateSelectAllState() {
        const selectAll = document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        const visibleCheckboxes = Array.from(rowCheckboxes).filter(cb => {
            return cb.closest('.table-row-admin').style.display !== 'none';
        });
        
        if (visibleCheckboxes.length === 0) return;
        
        const allChecked = visibleCheckboxes.every(cb => cb.checked);
        const someChecked = visibleCheckboxes.some(cb => cb.checked);
        
        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
    }
    
    function updateBulkActionsBar() {
        const bulkActionsBar = document.getElementById('bulkActionsBar');
        const selectedCount = document.getElementById('selectedCount');
        const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
        
        if (checkedBoxes.length > 0) {
            bulkActionsBar.classList.add('active');
            selectedCount.textContent = checkedBoxes.length;
        } else {
            bulkActionsBar.classList.remove('active');
        }
    }
    
    // ============================================
    // BULK ACTIONS
    // ============================================
    function initBulkActions() {
        const markPaidBtn = document.querySelector('.btn-mark-paid');
        const markUnpaidBtn = document.querySelector('.btn-mark-unpaid');
        const bulkDeleteBtn = document.querySelector('.btn-bulk-delete');
        
        if (markPaidBtn) {
            markPaidBtn.addEventListener('click', function() {
                const selected = getSelectedRequests();
                if (confirm(`Mark ${selected.length} request(s) as paid?`)) {
                    bulkUpdateStatus(selected, 'paid');
                }
            });
        }
        
        if (markUnpaidBtn) {
            markUnpaidBtn.addEventListener('click', function() {
                const selected = getSelectedRequests();
                if (confirm(`Mark ${selected.length} request(s) as unpaid?`)) {
                    bulkUpdateStatus(selected, 'unpaid');
                }
            });
        }
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', function() {
                const selected = getSelectedRequests();
                if (confirm(`Delete ${selected.length} request(s)? This action cannot be undone.`)) {
                    bulkDelete(selected);
                }
            });
        }
    }
    
    function getSelectedRequests() {
        const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
        return Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));
    }
    
    function bulkUpdateStatus(ids, status) {
        showNotification(`Updating ${ids.length} request(s)...`, 'info');
        
        // Simulate API call
        setTimeout(() => {
            ids.forEach(id => {
                const checkbox = document.querySelector(`.row-checkbox[data-id="${id}"]`);
                const row = checkbox.closest('.table-row-admin');
                const statusBadge = row.querySelector('.status-badge-admin');
                
                row.setAttribute('data-status', status);
                
                if (status === 'paid') {
                    statusBadge.className = 'status-badge-admin status-paid-admin';
                    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Paid';
                } else {
                    statusBadge.className = 'status-badge-admin status-unpaid-admin';
                    statusBadge.innerHTML = '<i class="fas fa-clock"></i> Unpaid';
                }
                
                checkbox.checked = false;
            });
            
            updateBulkActionsBar();
            showNotification(`Successfully updated ${ids.length} request(s)`, 'success');
        }, 800);
    }
    
    function bulkDelete(ids) {
        showNotification(`Deleting ${ids.length} request(s)...`, 'info');
        
        // Simulate API call
        setTimeout(() => {
            ids.forEach(id => {
                const checkbox = document.querySelector(`.row-checkbox[data-id="${id}"]`);
                const row = checkbox.closest('.table-row-admin');
                row.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    row.remove();
                    updateBulkActionsBar();
                }, 300);
            });
            
            showNotification(`Successfully deleted ${ids.length} request(s)`, 'success');
        }, 800);
    }
    
    // ============================================
    // ACTION BUTTONS
    // ============================================
    function initActionButtons() {
        const editButtons = document.querySelectorAll('.btn-edit');
        const deleteButtons = document.querySelectorAll('.btn-delete');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                showNotification('Edit functionality coming soon!', 'info');
                // Implement edit functionality
            });
        });
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Delete this request? This action cannot be undone.')) {
                    deleteRequest(id);
                }
            });
        });
    }
    
    function deleteRequest(id) {
        showNotification('Deleting request...', 'info');
        
        const row = document.querySelector(`.row-checkbox[data-id="${id}"]`).closest('.table-row-admin');
        row.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            row.remove();
            showNotification('Request deleted successfully', 'success');
        }, 300);
    }
    
    // ============================================
    // EXPORT FUNCTIONALITY
    // ============================================
    function initExport() {
        const exportBtn = document.getElementById('exportBtn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                showNotification('Exporting data...', 'info');
                
                // Simulate export
                setTimeout(() => {
                    showNotification('Data exported successfully!', 'success');
                    // Implement actual export logic here
                }, 1000);
            });
        }
    }
    
    // ============================================
    // QUICK STATS
    // ============================================
    function initQuickStats() {
        const statsToggle = document.getElementById('statsToggle');
        const statsContent = document.getElementById('statsContent');
        
        if (statsToggle && statsContent) {
            statsToggle.addEventListener('click', function() {
                statsContent.classList.toggle('active');
            });
            
            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.quick-stats-card')) {
                    statsContent.classList.remove('active');
                }
            });
        }
    }
    
    // ============================================
    // EMPTY STATE
    // ============================================
    function updateEmptyState(visibleCount) {
        const tbody = document.querySelector('.admin-table tbody');
        let emptyRow = tbody.querySelector('.empty-row-admin');
        
        if (visibleCount === 0 && !emptyRow) {
            emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row-admin';
            emptyRow.innerHTML = `
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">No requests found</p>
                    <p style="font-size: 0.9rem; margin: 0.5rem 0 0;">Try adjusting your search or filters</p>
                </td>
            `;
            tbody.appendChild(emptyRow);
        } else if (visibleCount > 0 && emptyRow) {
            emptyRow.remove();
        }
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        
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
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-20px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // ANIMATIONS
    // ============================================
    function initAnimations() {
        const rows = document.querySelectorAll('.table-row-admin');
        
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchRequests')?.focus();
        }
        
        // Escape - Clear selection
        if (e.key === 'Escape') {
            document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
                cb.checked = false;
            });
            document.getElementById('selectAll').checked = false;
            updateBulkActionsBar();
        }
    });
    
    console.log('Admin requests page initialized successfully');
});