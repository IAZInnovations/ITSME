// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile-specific AOS settings
    const isMobile = window.innerWidth < 768;
    
    AOS.init({
        duration: isMobile ? 600 : 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: false,
        offset: isMobile ? 50 : 100
    });

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Initialize particles.js with reduced particles for mobile
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: isMobile ? 40 : 80, 
                    density: { enable: true, value_area: 800 } 
                },
                color: { value: '#3b82f6' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: isMobile ? 2 : 3, random: true },
                line_linked: {
                    enable: true,
                    distance: isMobile ? 100 : 150,
                    color: '#3b82f6',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? 1 : 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: isMobile ? 100 : 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Mobile menu toggle with improved touch handling
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        // Use both click and touchend events for better mobile response
        ['click', 'touchend'].forEach(evt => {
            menuToggle.addEventListener(evt, function(e) {
                if (evt === 'touchend') e.preventDefault();
                mobileMenu.classList.toggle('hidden');
            });
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            ['click', 'touchend'].forEach(evt => {
                link.addEventListener(evt, function(e) {
                    if (evt === 'touchend') e.preventDefault();
                    mobileMenu.classList.add('hidden');
                    
                    // Smooth scroll to the section on mobile
                    const href = this.getAttribute('href');
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            const headerOffset = 70;
                            const elementPosition = targetElement.offsetTop;
                            const offsetPosition = elementPosition - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        });
    }

    // Navbar scroll behavior
    const navbar = document.querySelector('nav');
    if (navbar) {
        let lastScrollTop = 0;
        let scrollTimer;
        
        window.addEventListener('scroll', function() {
            // Throttle scroll events for better mobile performance
            if (!scrollTimer) {
                scrollTimer = setTimeout(function() {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    
                    // Navbar color change based on scroll
                    if (scrollTop > 50) {
                        navbar.classList.add('bg-gray-900');
                        navbar.classList.remove('bg-gray-900/80');
                    } else {
                        navbar.classList.remove('bg-gray-900');
                        navbar.classList.add('bg-gray-900/80');
                    }
                    
                    // Reset throttle timer
                    scrollTimer = null;
                    lastScrollTop = scrollTop;
                }, 100);
            }
        });
    }

    // Highlight active navigation based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust the offset for mobile
            const offset = isMobile ? 150 : 200;
            if (window.scrollY >= (sectionTop - offset)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('nav-active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('nav-active');
            }
        });
    });

    // GSAP animations for the energy aura in manifesto section
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to('#energy-aura', {
            scrollTrigger: {
                trigger: '#manifesto',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
            },
            opacity: 0.4,
            duration: 2
        });

        // Animate skill bars when in view
        gsap.utils.toArray('.skill-bar').forEach(bar => {
            gsap.fromTo(
                bar, 
                { width: 0 }, 
                {
                    width: bar.style.width,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 80%'
                    }
                }
            );
        });
    }

    // Initialize gallery (if images exist)
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        // Gallery lightbox functionality 
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            galleryItems.forEach(item => {
                ['click', 'touchend'].forEach(evt => {
                    item.addEventListener(evt, function(e) {
                        if (evt === 'touchend') e.preventDefault();
                        const imgSrc = this.querySelector('img').getAttribute('src');
                        openLightbox(imgSrc);
                    });
                });
            });
        } else {
            // Display a message if no images are present
            galleryGrid.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-xl text-gray-400">No images are currently available.</p>
                </div>
            `;
        }
    }
});

// Lightbox functionality with touch support
function openLightbox(imgSrc) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="${imgSrc}" class="lightbox-content">
    `;
    
    document.body.appendChild(lightbox);
    
    // Add active class after a small delay to trigger transition
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Close lightbox on click or touch
    ['click', 'touchend'].forEach(evt => {
        lightbox.addEventListener(evt, function(e) {
            if (evt === 'touchend') e.preventDefault();
            lightbox.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        });
    });
}

// Adjust for viewport height on mobile devices
function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height and update on resize
setMobileViewportHeight();
window.addEventListener('resize', setMobileViewportHeight);

// Fix for iOS touch events on fixed elements
document.addEventListener('touchmove', function(e) {
    if (document.querySelector('.lightbox.active')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            // Scroll to the target
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Offset for navbar
                behavior: 'smooth'
            });
        }
    });
}); 