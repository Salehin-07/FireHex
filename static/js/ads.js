/**
 * Advertisement Popup Script
 * Handles the advertisement popup modal with localStorage persistence per ad
 * All variables prefixed with 'arads' to avoid conflicts
 */

(function() {
    'use strict';
    
    // Configuration
    const aradsConfig = {
        storageKeyPrefix: 'aradsShown_', // Will be combined with ad ID
        neverShowKeyPrefix: 'aradsNeverShow_', // Will be combined with ad ID
        delayMs: 2000, // Delay before showing popup (2 seconds)
        expiryDays: 1 // Days before showing again if closed normally
    };
    
    // DOM Elements
    let aradsOverlay;
    let aradsCloseBtn;
    let aradsCloseAdBtn;
    let aradsNeverShowCheckbox;
    let aradsCurrentAdId = null;
    
    /**
     * Initialize the advertisement popup
     */
    function aradsInit() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', aradsSetup);
        } else {
            aradsSetup();
        }
    }
    
    /**
     * Setup the popup after DOM is ready
     */
    function aradsSetup() {
        // Get DOM elements
        aradsOverlay = document.getElementById('aradsWelcomeOverlay');
        
        if (!aradsOverlay) {
            // No ad to display
            return;
        }
        
        aradsCloseBtn = document.getElementById('aradsCloseBtn');
        aradsCloseAdBtn = document.getElementById('aradsCloseAd');
        aradsNeverShowCheckbox = document.getElementById('aradsNeverShowAgain');
        
        // Get current ad ID from data attribute
        aradsCurrentAdId = aradsOverlay.getAttribute('data-ad-id');
        
        if (!aradsCurrentAdId) {
            console.warn('AR Ads: No ad ID found');
            return;
        }
        
        // Attach event listeners
        aradsAttachEvents();
        
        // Check if popup should be shown
        if (aradsShouldShowPopup()) {
            aradsShowPopup();
        }
    }
    
    /**
     * Attach event listeners to interactive elements
     */
    function aradsAttachEvents() {
        // Close buttons
        if (aradsCloseBtn) {
            aradsCloseBtn.addEventListener('click', aradsHandleClose);
        }
        
        if (aradsCloseAdBtn) {
            aradsCloseAdBtn.addEventListener('click', aradsHandleClose);
        }
        
        // Close on overlay click (outside modal)
        aradsOverlay.addEventListener('click', function(e) {
            if (e.target === aradsOverlay) {
                aradsHandleClose();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && aradsOverlay.classList.contains('arads-active')) {
                aradsHandleClose();
            }
        });
        
        // Prevent body scroll when popup is open
        aradsOverlay.addEventListener('transitionend', function() {
            if (aradsOverlay.classList.contains('arads-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    /**
     * Check if popup should be shown for this specific ad
     * @returns {boolean}
     */
    function aradsShouldShowPopup() {
        if (!aradsCurrentAdId) {
            return false;
        }
        
        // Check if user opted to never show this specific ad again
        const neverShowKey = aradsConfig.neverShowKeyPrefix + aradsCurrentAdId;
        if (aradsGetStorage(neverShowKey) === 'true') {
            return false;
        }
        
        // Check if this ad was recently shown
        const storageKey = aradsConfig.storageKeyPrefix + aradsCurrentAdId;
        const lastShown = aradsGetStorage(storageKey);
        
        if (lastShown) {
            const lastShownDate = new Date(lastShown);
            const now = new Date();
            const daysDiff = (now - lastShownDate) / (1000 * 60 * 60 * 24);
            
            if (daysDiff < aradsConfig.expiryDays) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Show the popup with delay
     */
    function aradsShowPopup() {
        setTimeout(function() {
            aradsOverlay.classList.add('arads-active');
            
            // Mark as shown in localStorage
            const storageKey = aradsConfig.storageKeyPrefix + aradsCurrentAdId;
            aradsSetStorage(storageKey, new Date().toISOString());
            
            // Track analytics
            aradsTrackEvent('ad_shown', aradsCurrentAdId);
        }, aradsConfig.delayMs);
    }
    
    /**
     * Hide the popup
     */
    function aradsHidePopup() {
        aradsOverlay.classList.remove('arads-active');
    }
    
    /**
     * Handle close button click
     */
    function aradsHandleClose() {
        // Check if "never show again" is checked
        if (aradsNeverShowCheckbox && aradsNeverShowCheckbox.checked) {
            const neverShowKey = aradsConfig.neverShowKeyPrefix + aradsCurrentAdId;
            aradsSetStorage(neverShowKey, 'true');
            aradsTrackEvent('ad_never_show', aradsCurrentAdId);
        }
        
        aradsHidePopup();
        aradsTrackEvent('ad_closed', aradsCurrentAdId);
    }
    
    /**
     * Get value from localStorage
     * @param {string} key
     * @returns {string|null}
     */
    function aradsGetStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('AR Ads: localStorage not available', e);
            return null;
        }
    }
    
    /**
     * Set value in localStorage
     * @param {string} key
     * @param {string} value
     */
    function aradsSetStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('AR Ads: localStorage not available', e);
        }
    }
    
    /**
     * Track events (integrate with your analytics)
     * @param {string} eventName
     * @param {string} adId
     */
    function aradsTrackEvent(eventName, adId) {
        // Integrate with Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'advertisement',
                'event_label': 'ad_id_' + adId,
                'value': adId
            });
        }
        
        // Console log for debugging
        console.log('AR Ads Event:', eventName, 'Ad ID:', adId);
        
        // You can also send to your Django backend for tracking
        // Example: Send impression/interaction data
        // aradsTrackToBackend(eventName, adId);
    }
    
    /**
     * Optional: Send tracking data to Django backend
     * @param {string} eventName
     * @param {string} adId
     */
    function aradsTrackToBackend(eventName, adId) {
        // Example implementation
        // fetch('/api/ads/track/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': aradsGetCsrfToken()
        //     },
        //     body: JSON.stringify({
        //         event: eventName,
        //         ad_id: adId,
        //         timestamp: new Date().toISOString()
        //     })
        // }).catch(function(error) {
        //     console.error('AR Ads: Tracking error', error);
        // });
    }
    
    /**
     * Get CSRF token for Django POST requests
     * @returns {string}
     */
    function aradsGetCsrfToken() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('csrftoken=')) {
                return cookie.substring('csrftoken='.length);
            }
        }
        return '';
    }
    
    /**
     * Public API for manual control (optional)
     */
    window.aradsAPI = {
        show: aradsShowPopup,
        hide: aradsHidePopup,
        reset: function(adId) {
            if (!adId && aradsCurrentAdId) {
                adId = aradsCurrentAdId;
            }
            if (adId) {
                aradsSetStorage(aradsConfig.storageKeyPrefix + adId, '');
                aradsSetStorage(aradsConfig.neverShowKeyPrefix + adId, '');
                console.log('AR Ads: Preferences reset for ad ID:', adId);
            }
        },
        resetAll: function() {
            // Clear all ad-related localStorage
            const keys = Object.keys(localStorage);
            keys.forEach(function(key) {
                if (key.startsWith('aradsShown_') || key.startsWith('aradsNeverShow_')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('AR Ads: All ad preferences cleared');
        }
    };
    
    // Initialize
    aradsInit();
    
})();
