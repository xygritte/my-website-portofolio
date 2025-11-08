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