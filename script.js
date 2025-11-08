class PortfolioApp {
    constructor() {
        this.helloWorldSection = document.getElementById('hello-world');
        this.sections = document.querySelectorAll('.hero, .skills-section, .projects-section');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.logoLink = document.querySelector('.logo-link');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLogoLink();
        this.setupKeyboardNavigation();
        
        // Show initial section based on URL hash
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            this.showSection(hash);
        } else {
            this.showSection('hello-world');
        }
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = event.target.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                // Update URL without page reload
                history.pushState(null, null, `#${targetId}`);
            });

            // Add keyboard accessibility
            link.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    link.click();
                }
            });
        });
    }

    setupLogoLink() {
        if (this.logoLink) {
            this.logoLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.showSection('hello-world');
                history.pushState(null, null, '#hello-world');
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Escape key to return to home
            if (event.key === 'Escape') {
                this.showSection('hello-world');
                history.pushState(null, null, '#hello-world');
            }
        });
    }

    showSection(sectionId) {
        console.log('Showing section:', sectionId); // Debug log
        
        // Hide all sections
        this.helloWorldSection.style.display = 'none';
        this.sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            if (sectionId === 'hello-world') {
                this.helloWorldSection.style.display = 'flex';
            } else {
                targetSection.style.display = 'flex';
            }
        }

        // Update active states
        this.updateActiveNavLink(sectionId);
    }

    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            const linkId = link.getAttribute('href').substring(1);
            if (linkId === activeId) {
                link.setAttribute('aria-current', 'page');
                link.style.borderBottomColor = 'tomato';
            } else {
                link.removeAttribute('aria-current');
                link.style.borderBottomColor = 'transparent';
            }
        });
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        app.showSection(hash);
    } else {
        app.showSection('hello-world');
    }
});

// Email copy function (keep your existing function)
// function copyText() {
//     const email = "ramadhani.frqn";
    
//     navigator.clipboard.writeText(email).then(() => {
//         showNotification('copied to clipboard!');
//     }).catch(err => {
//         console.error('Failed to copy: ', err);
//         showNotification('Failed to copy. Please try again.', true);
//     });
// }

// Notification function (keep your existing function)
function showNotification(message, isError = false) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#e74c3c' : '#2ecc71'};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyles);
}

// Add this CSS to your stylesheet or in a style tag
const mobileNotificationCSS = `
.mobile-notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}
.mobile-notification.active {
    opacity: 1;
    visibility: visible;
}
.notification-content {
    background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(193, 0, 164, 0.7);
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    max-width: 300px;
    width: 80%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
.notification-content h3 {
    margin: 0 0 15px 0;
    color: #000000ff;
    font-size: 18px;
}
.notification-content p {
    margin: 0 0 20px 0;
    color: #ffffffff;
    font-size: 14px;
}
.close-btn {
    background: rgba(255, 255, 255, 0.4);
    border: none;
    border-radius: 50px;
    padding: 10px 25px;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}
.close-btn:hover {
    transition: 0.3s ease-in-out;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px 38px;
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = mobileNotificationCSS;
document.head.appendChild(style);

// Create notification HTML
const notificationHTML = `
<div class="mobile-notification" id="mobileNotification">
    <div class="notification-content">
        <h3>Mobile Detected</h3>
        <p>For better experience, we recommend using your desktop browser.</p>
        <button class="close-btn" onclick="closeMobileNotification()">Got it!</button>
    </div>
</div>
`;

// Add notification to body
document.body.insertAdjacentHTML('beforeend', notificationHTML);

// Mobile detection function
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// Close notification function
function closeMobileNotification() {
    const notification = document.getElementById('mobileNotification');
    notification.classList.remove('active');
    localStorage.setItem('mobileNotificationClosed', 'true');
}

// Show notification
function showMobileNotification() {
    if (isMobileDevice() && !localStorage.getItem('mobileNotificationClosed')) {
        setTimeout(() => {
            const notification = document.getElementById('mobileNotification');
            notification.classList.add('active');
        }, 1000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', showMobileNotification);

// Close when clicking outside
document.getElementById('mobileNotification').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMobileNotification();
    }
});