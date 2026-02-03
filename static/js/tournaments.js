// ============================================
// TOURNAMENTS PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initSearch();
    initFilters();
    initAnimations();
    initScrollEffects();
    
    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    function initSearch() {
        const searchInput = document.getElementById('searchTournaments');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterTournaments(searchTerm);
        });
    }
    
    function filterTournaments(searchTerm) {
        const cards = document.querySelectorAll('.tournament-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.tournament-title')?.textContent.toLowerCase() || '';
            const game = card.querySelector('.game-badge')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || game.includes(searchTerm)) {
                card.style.display = '';
                visibleCount++;
                // Stagger animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide empty state
        updateEmptyState(visibleCount);
    }
    
    // ============================================
    // FILTER FUNCTIONALITY
    // ============================================
    function initFilters() {
        const gameFilter = document.getElementById('gameFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (gameFilter) {
            gameFilter.addEventListener('change', applyFilters);
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', applyFilters);
        }
    }
    
    function applyFilters() {
        const gameFilter = document.getElementById('gameFilter')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value.toLowerCase() || '';
        const searchTerm = document.getElementById('searchTournaments')?.value.toLowerCase() || '';
        
        const cards = document.querySelectorAll('.tournament-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const game = card.getAttribute('data-game') || '';
            const title = card.querySelector('.tournament-title')?.textContent.toLowerCase() || '';
            const gameBadge = card.querySelector('.game-badge')?.textContent.toLowerCase() || '';
            
            const matchesGame = !gameFilter || game === gameFilter;
            const matchesSearch = !searchTerm || title.includes(searchTerm) || gameBadge.includes(searchTerm);
            
            if (matchesGame && matchesSearch) {
                card.style.display = '';
                visibleCount++;
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        updateEmptyState(visibleCount);
    }
    
    // ============================================
    // EMPTY STATE
    // ============================================
    function updateEmptyState(visibleCount) {
        const grid = document.getElementById('tournamentsGrid');
        if (!grid) return;
        
        let emptyState = document.querySelector('.filter-empty-state');
        
        if (visibleCount === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'filter-empty-state';
                emptyState.innerHTML = `
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="empty-title">No tournaments found</h3>
                    <p class="empty-text">Try adjusting your search or filters</p>
                `;
                emptyState.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                `;
                grid.appendChild(emptyState);
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    }
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initAnimations() {
        const cards = document.querySelectorAll('.tournament-card');
        
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
    // SCROLL EFFECTS
    // ============================================
    function initScrollEffects() {
        const hero = document.querySelector('.tournaments-hero');
        if (!hero) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxSpeed = 0.5;
                    
                    if (hero) {
                        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
    
    // ============================================
    // COUNTDOWN TIMER (Optional Feature)
    // ============================================
    function initCountdowns() {
        const cards = document.querySelectorAll('.tournament-card');
        
        cards.forEach(card => {
            const startDate = card.getAttribute('data-start-date');
            if (startDate) {
                updateCountdown(card, startDate);
                setInterval(() => updateCountdown(card, startDate), 60000); // Update every minute
            }
        });
    }
    
    function updateCountdown(card, startDate) {
        const now = new Date().getTime();
        const start = new Date(startDate).getTime();
        const distance = start - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            let countdownElement = card.querySelector('.countdown-timer');
            if (!countdownElement) {
                countdownElement = document.createElement('div');
                countdownElement.className = 'countdown-timer';
                countdownElement.style.cssText = `
                    padding: 0.5rem 1rem;
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--primary-color);
                    text-align: center;
                    margin-top: 1rem;
                `;
                card.querySelector('.card-body').appendChild(countdownElement);
            }
            
            countdownElement.textContent = `Starts in ${days}d ${hours}h`;
        }
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // CARD HOVER EFFECTS
    // ============================================
    const tournamentCards = document.querySelectorAll('.tournament-card');
    
    tournamentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // ============================================
    // LOADING ANIMATION
    // ============================================
    function showLoadingState() {
        const grid = document.getElementById('tournamentsGrid');
        if (grid && grid.children.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <div class="loading-spinner" style="
                        width: 50px;
                        height: 50px;
                        border: 4px solid var(--bg-light);
                        border-top-color: var(--primary-color);
                        border-radius: 50%;
                        margin: 0 auto 1rem;
                        animation: spin 1s linear infinite;
                    "></div>
                    <p style="color: var(--text-light);">Loading tournaments...</p>
                </div>
            `;
        }
    }
    
    // Add CSS for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // INITIALIZE TOOLTIPS (Optional)
    // ============================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
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
                `;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
                tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                
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
    
    console.log('Tournaments page initialized successfully');
});