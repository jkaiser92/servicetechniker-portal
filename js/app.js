// Servicetechniker Portal - App Logic

(function() {
  'use strict';

  // DOM Elements
  const offlineIndicator = document.getElementById('offlineIndicator');
  const installBanner = document.getElementById('installBanner');
  const installBtn = document.getElementById('installBtn');
  const dismissBtn = document.getElementById('dismissBtn');

  // PWA Install Prompt
  let deferredPrompt = null;

  // ============================================
  // Service Worker Registration
  // ============================================
  
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('sw.js');
        
        console.log('[App] ServiceWorker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[App] New ServiceWorker installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('[App] New version available');
              showUpdateNotification();
            }
          });
        });

      } catch (error) {
        console.error('[App] ServiceWorker registration failed:', error);
      }
    }
  }

  function showUpdateNotification() {
    // Simple reload prompt for updates
    if (confirm('Eine neue Version ist verfügbar. Jetzt aktualisieren?')) {
      window.location.reload();
    }
  }

  // ============================================
  // Online/Offline Detection
  // ============================================

  function updateOnlineStatus() {
    if (navigator.onLine) {
      offlineIndicator.classList.remove('visible');
    } else {
      offlineIndicator.classList.add('visible');
    }
  }

  function setupOnlineOfflineListeners() {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check
  }

  // ============================================
  // PWA Install Prompt
  // ============================================

  function setupInstallPrompt() {
    // Capture the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[App] beforeinstallprompt fired');
      e.preventDefault();
      deferredPrompt = e;
      
      // Check if user hasn't dismissed the banner recently
      const dismissed = localStorage.getItem('installBannerDismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (!dismissed || (Date.now() - dismissedTime > dayInMs * 7)) {
        showInstallBanner();
      }
    });

    // Handle install button click
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        console.log('[App] Showing install prompt');
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[App] Install prompt outcome:', outcome);
        
        deferredPrompt = null;
        hideInstallBanner();
      });
    }

    // Handle dismiss button click
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        hideInstallBanner();
        localStorage.setItem('installBannerDismissed', Date.now().toString());
      });
    }

    // Detect when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('[App] App was installed');
      hideInstallBanner();
      deferredPrompt = null;
    });
  }

  function showInstallBanner() {
    if (installBanner) {
      installBanner.classList.add('visible');
    }
  }

  function hideInstallBanner() {
    if (installBanner) {
      installBanner.classList.remove('visible');
    }
  }

  // ============================================
  // Portal Card Click Tracking (Optional)
  // ============================================

  function setupCardTracking() {
    const cards = document.querySelectorAll('.portal-card');
    
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const cardName = card.classList.contains('kasys') ? 'KASYS' : 'Telekom';
        console.log(`[App] Portal clicked: ${cardName}`);
        
        // Track last visited portal
        localStorage.setItem('lastVisited', JSON.stringify({
          portal: cardName,
          timestamp: Date.now()
        }));
      });
    });
  }

  // ============================================
  // Initialize App
  // ============================================

  function init() {
    console.log('[App] Initializing Servicetechniker Portal');
    
    registerServiceWorker();
    setupOnlineOfflineListeners();
    setupInstallPrompt();
    setupCardTracking();
    
    console.log('[App] Initialization complete');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
