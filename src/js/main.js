document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Nav Logic ---
    const nav = document.querySelector('.nav-fixed');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const hamburger = document.querySelector('.hamburger');
    const navWrapper = document.querySelector('.nav-pill-wrapper');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navWrapper.classList.toggle('active');
            
            // Toggle Aria for accessibility
            const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            hamburger.setAttribute('aria-expanded', !expanded);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    hamburger.classList.remove('active');
                    navWrapper.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }, 400); 
            });
        });
    }

    // Pill Logic (Desktop Only)
    function movePill(target) {
        if (window.innerWidth <= 768) return;
        
        let style = document.getElementById('nav-pill-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'nav-pill-style';
            document.head.appendChild(style);
        }

        const listRect = navList.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const left = targetRect.left - listRect.left;
        const width = targetRect.width;

        style.innerHTML = `
            .nav-list::after {
                transform: translateX(${left}px);
                width: ${width}px;
                opacity: 1;
            }
        `;
        navList.classList.add('has-pill');
    }

    const activeLink = document.querySelector('.nav-list a.active');
    if (activeLink && window.innerWidth > 768) setTimeout(() => movePill(activeLink), 100);

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => movePill(e.target.closest('a')));
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.closest('a').classList.add('active');
        });
    });

    if(navList) {
        navList.addEventListener('mouseleave', () => {
            const currentActive = document.querySelector('.nav-list a.active');
            if (currentActive) movePill(currentActive);
            else navList.classList.remove('has-pill');
        });
    }


    // --- 2. Animations (General Observer) ---
    const triggerObserverOptions = {
        rootMargin: "0px 0px -15% 0px", 
        threshold: 0.05 
    };

    const triggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = parseInt(target.getAttribute('data-delay') || 0);

                setTimeout(() => {
                    target.classList.add('in-view');
                    if (target.classList.contains('fade-in-text')) target.classList.add('in-view');
                }, delay);

                if (target.classList.contains('split-header') || target.classList.contains('stat-number')) {
                    observer.unobserve(target);
                }
            }
        });
    }, triggerObserverOptions);

    document.querySelectorAll('.fade-up, .reveal-mask, .split-header').forEach(el => triggerObserver.observe(el));
    
    // Initial hero text load
    const heroText = document.querySelector('.hero-sub-mask p');
    if(heroText) setTimeout(() => heroText.classList.add('in-view'), 500);

    // Split Header Logic
    document.querySelectorAll('.split-header').forEach(header => {
        const text = header.innerText;
        header.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            // Fix: Use non-breaking space for ' '
            span.innerHTML = char === ' ' ? '&nbsp;' : char; 
            span.style.transitionDelay = `${index * 0.02}s`; 
            header.appendChild(span);
        });
        triggerObserver.observe(header);
    });

    // Stats Logic
    document.querySelectorAll('.stat-number').forEach(el => {
        const statItem = el.closest('.stat-item');
        triggerObserver.observe(statItem); 
        
        statItem.addEventListener('transitionend', function handler(e) {
            // Only trigger if opacity finished
            if (e.propertyName === 'opacity' && statItem.classList.contains('in-view')) {
                 animateValue(el);
                 statItem.removeEventListener('transitionend', handler);
            }
        });
    });

    function animateValue(obj) {
        if(obj.dataset.animated) return;
        obj.dataset.animated = "true";

        const target = parseFloat(obj.getAttribute('data-target'));
        const suffix = obj.getAttribute('data-suffix');
        const duration = 2500;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); 
            
            obj.innerHTML = Math.floor(easeProgress * target) + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }


    // --- 3. Parallax Effect (Optimized) ---
    function animateParallax() {
        const scrollY = window.scrollY;
        
        // Hero Image
        const heroImg = document.querySelector('.parallax-hero');
        if (heroImg) {
           
            heroImg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`; 
        }

        // Other Items
        document.querySelectorAll('.parallax-item').forEach(item => {
            const rect = item.getBoundingClientRect();
            // Optimization: Only animate if inside viewport
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const center = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const diff = center - viewportCenter;
                const speed = 0.15; 
                
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = `translate3d(0, ${-diff * speed}px, 0)`;
                }
            }
        });

        requestAnimationFrame(animateParallax);
    }
    requestAnimationFrame(animateParallax);


    // --- 4. Core Values Scroll Automation ---
    const valuesObserverOptions = {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // Middle 10%
        threshold: 0
    };

    const valuesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                document.querySelectorAll('.value-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.value-desc').forEach(d => d.classList.remove('active'));

                // Add active to current
                entry.target.classList.add('active');
                
                const id = entry.target.getAttribute('data-id');
                const targetDesc = document.querySelector(`.value-desc[data-id="${id}"]`);
                if (targetDesc) {
                    targetDesc.classList.add('active');
                }
            }
        });
    }, valuesObserverOptions);

    document.querySelectorAll('.value-item').forEach(item => {
        valuesObserver.observe(item);
    });

});