class PortfolioApp {
    constructor() {
        this.helloWorldSection = document.getElementById('hello-world');
        this.sections = document.querySelectorAll('.hero, .skills-section, .projects-section');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.logoLink = document.querySelector('.logo-link');
        
        // Variabel untuk scroll navigation
        this.sectionIds = ['hello-world', 'about', 'skill', 'project'];
        this.currentSectionIndex = 0;
        this.isScrolling = false;
        this.scrollDelay = 600; // Lebih cepat dari 1000ms
        this.scrollThreshold = 30; // Lebih sensitif dari 50px
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLogoLink();
        this.setupKeyboardNavigation();
        this.setupScrollNavigation();
        this.setupExpandableSections();
        
        // Show initial section based on URL hash
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            this.showSection(hash);
            this.currentSectionIndex = this.sectionIds.indexOf(hash);
        } else {
            this.showSection('hello-world');
            this.currentSectionIndex = 0;
        }

        // Create scroll indicator
        this.createScrollIndicator();
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = event.target.getAttribute('href').substring(1);
                this.showSection(targetId);
                this.currentSectionIndex = this.sectionIds.indexOf(targetId);
                this.updateScrollIndicator();
                
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
                this.currentSectionIndex = 0;
                this.updateScrollIndicator();
                history.pushState(null, null, '#hello-world');
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Escape key to return to home
            if (event.key === 'Escape') {
                this.showSection('hello-world');
                this.currentSectionIndex = 0;
                this.updateScrollIndicator();
                history.pushState(null, null, '#hello-world');
            }
            
            // Arrow keys for navigation
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                this.nextSection();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                this.previousSection();
            }
        });
    }

    // Method untuk setup scroll navigation yang sensitif
    setupScrollNavigation() {
        let scrollTimeout;
        let touchStartY = 0;
        
        // Variabel instance untuk track scroll position
        this.isAtTop = false;
        this.isAtBottom = false;
        
        // Fungsi untuk check posisi scroll
        const checkScrollPosition = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            
            this.isAtTop = scrollTop <= this.scrollThreshold;
            this.isAtBottom = (scrollHeight - scrollTop - clientHeight) <= this.scrollThreshold;
        };
        
        // Mouse wheel event - LEBIH SENSITIF
        window.addEventListener('wheel', (e) => {
            // Check posisi scroll terlebih dahulu
            checkScrollPosition();
            
            // Cek jika di expanded section, biarkan scroll normal
            const expandedSection = document.querySelector('.skills-section.expanded, .projects-section.expanded');
            if (expandedSection) {
                const sectionRect = expandedSection.getBoundingClientRect();
                const isInExpandedSection = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
                
                if (isInExpandedSection) {
                    // Biarkan user scroll di dalam expanded content
                    return;
                }
            }
            
            // Hanya proses jika di ujung atas atau bawah - DENGAN THRESHOLD LEBIH RENDAH
            if ((e.deltaY > 0 && this.isAtBottom) || (e.deltaY < 0 && this.isAtTop)) {
                // Clear existing timeout
                clearTimeout(scrollTimeout);
                
                // Set timeout yang lebih pendek untuk responsivitas lebih baik
                scrollTimeout = setTimeout(() => {
                    if (this.isScrolling) return;
                    
                    this.isScrolling = true;
                    
                    // Tentukan arah scroll dengan sensitivity tinggi
                    if (e.deltaY > 0 && this.isAtBottom) {
                        // Scroll down di ujung bawah - next section
                        this.nextSection();
                    } else if (e.deltaY < 0 && this.isAtTop) {
                        // Scroll up di ujung atas - previous section
                        this.previousSection();
                    }
                    
                    // Reset scrolling flag dengan delay lebih pendek
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, this.scrollDelay);
                    
                }, 50); // Timeout lebih pendek dari 150ms
            }
        }, { passive: true });

        // Touch events untuk mobile - LEBIH SENSITIF
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            checkScrollPosition();
        }, { passive: true });
        
        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Minimum swipe distance dikurangi untuk sensitivity lebih baik
            if (Math.abs(diff) < 30) return; // Dari 50px menjadi 30px
            
            // Cek jika di expanded section
            const expandedSection = document.querySelector('.skills-section.expanded, .projects-section.expanded');
            if (expandedSection) {
                const sectionRect = expandedSection.getBoundingClientRect();
                const isInExpandedSection = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
                
                if (isInExpandedSection) {
                    return; // Biarkan touch scroll di expanded content
                }
            }
            
            // Hanya proses swipe jika di ujung atas atau bawah
            if ((diff > 0 && this.isAtBottom) || (diff < 0 && this.isAtTop)) {
                this.isScrolling = true;
                
                if (diff > 0 && this.isAtBottom) {
                    // Swipe up di ujung bawah - next section
                    this.nextSection();
                } else if (diff < 0 && this.isAtTop) {
                    // Swipe down di ujung atas - previous section
                    this.previousSection();
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, this.scrollDelay);
            }
        }, { passive: true });

        // Juga check scroll position saat page load dan resize
        window.addEventListener('load', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        window.addEventListener('scroll', checkScrollPosition);

        // Prevent default spacebar scroll
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
            }
        });
    }

    // Method untuk setup expandable sections
    setupExpandableSections() {
        const expandTriggers = document.querySelectorAll('.expand-trigger');
        const sectionHeaders = document.querySelectorAll('.section-header');
        
        // Setup untuk expand triggers (judul section)
        expandTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const section = trigger.closest('.skills-section, .projects-section');
                if (section) {
                    this.toggleSection(section);
                }
            });

            // Add keyboard accessibility
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || event.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const section = trigger.closest('.skills-section, .projects-section');
                    if (section) {
                        this.toggleSection(section);
                    }
                }
            });
        });

        // Setup untuk section headers
        sectionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const section = header.closest('.skills-section, .projects-section');
                if (section) {
                    this.toggleSection(section);
                }
            });
        });
    }

    toggleSection(section) {
        const isExpanded = section.classList.contains('expanded');
        
        if (isExpanded) {
            section.classList.remove('expanded');
        } else {
            // Collapse other sections jika perlu
            document.querySelectorAll('.skills-section.expanded, .projects-section.expanded').forEach(expandedSection => {
                if (expandedSection !== section) {
                    expandedSection.classList.remove('expanded');
                }
            });
            
            section.classList.add('expanded');
            
            // Scroll ke section yang di-expand
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Method untuk pindah ke section berikutnya
    nextSection() {
        if (this.currentSectionIndex < this.sectionIds.length - 1) {
            this.currentSectionIndex++;
            const nextSectionId = this.sectionIds[this.currentSectionIndex];
            this.showSection(nextSectionId);
            this.updateScrollIndicator();
            history.pushState(null, null, `#${nextSectionId}`);
        }
    }

    // Method untuk pindah ke section sebelumnya
    previousSection() {
        if (this.currentSectionIndex > 0) {
            this.currentSectionIndex--;
            const prevSectionId = this.sectionIds[this.currentSectionIndex];
            this.showSection(prevSectionId);
            this.updateScrollIndicator();
            history.pushState(null, null, `#${prevSectionId}`);
        }
    }

    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
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
                targetSection.style.display = 'block';
                
                // JANGAN auto-expand section skill dan project
                // Biarkan user yang klik untuk expand
                if (sectionId === 'skill' || sectionId === 'project') {
                    // Pastikan section dalam state collapsed
                    targetSection.classList.remove('expanded');
                }
            }
            
            // Smooth scroll ke atas section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Update active states
        this.updateActiveNavLink(sectionId);
    }

    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            const linkId = link.getAttribute('href').substring(1);
            if (linkId === activeId) {
                link.setAttribute('aria-current', 'page');
                link.style.borderBottomColor = 'rgb(174, 0, 87)';
                link.style.backgroundImage = 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1))';
            } else {
                link.removeAttribute('aria-current');
                link.style.borderBottomColor = 'transparent';
                link.style.backgroundImage = 'none';
            }
        });
    }

    // Buat scroll indicator
    createScrollIndicator() {
        // Hapus existing indicator jika ada
        const existingIndicator = document.querySelector('.scroll-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = `
            <div class="scroll-dot" data-section="hello-world"></div>
            <div class="scroll-dot" data-section="about"></div>
            <div class="scroll-dot" data-section="skill"></div>
            <div class="scroll-dot" data-section="project"></div>
        `;
        
        document.body.appendChild(indicator);
        
        // Add click events untuk dots
        indicator.querySelectorAll('.scroll-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const sectionId = dot.getAttribute('data-section');
                this.showSection(sectionId);
                this.currentSectionIndex = index;
                this.updateScrollIndicator();
                history.pushState(null, null, `#${sectionId}`);
            });
        });
        
        this.updateScrollIndicator();
    }

    // Update scroll indicator
    updateScrollIndicator() {
        const dots = document.querySelectorAll('.scroll-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentSectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
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
    if (hash && app.sectionIds.includes(hash)) {
        app.showSection(hash);
        app.currentSectionIndex = app.sectionIds.indexOf(hash);
        app.updateScrollIndicator();
    } else {
        app.showSection('hello-world');
        app.currentSectionIndex = 0;
        app.updateScrollIndicator();
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
        
        /* Scroll Indicator Styles */
        .scroll-indicator {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background: rgba(0, 0, 0, 0.3);
            padding: 15px 8px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .scroll-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 2px solid transparent;
        }
        
        .scroll-dot:hover {
            background-color: rgba(255, 255, 255, 0.5);
            transform: scale(1.1);
        }
        
        .scroll-dot.active {
            background-color: var(--primary-color);
            transform: scale(1.3);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        /* Hide scroll indicator on mobile */
        @media screen and (max-width: 768px) {
            .scroll-indicator {
                display: none;
            }
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
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