document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Program Data---
    const programData = {
        cap: {
            img: "./images/students.jpg",
            tag: "Education",
            title: "College Assistance Program (CAP)",
            purpose: "The purpose of the College Assistance Program (CAP) is to help guide individuals to lifelong self-sufficiency by providing supplemental funds to attend a 4-year university as well as by providing individualized career coaching and training for financial literacy and life skills.",
            guidelines: "This is not a traditional scholarship program. SELFLESS does not award predetermined amounts. Recipients meet with a coach to determine the amount awarded based on personal needs. We strongly encourage recipients to attend BYU (Provo or Rexburg).",
            eligibility: [
                "Must have graduated high school, or be on track to graduate.",
                "Must demonstrate community involvement and academic improvement.",
                "Must have a strong desire to attend college."
            ],
            conditions: [
                "Maintain a 3.0 GPA.",
                "Enroll in a minimum of 14 credit hours per semester.",
                "Apply for FAFSA each year.",
                "Maintain a budget with your assigned coach.",
                "Encouraged to work 8-10 hours a week."
            ]
        },
        missionary: {
            img: "./images/missionary.jpg",
            tag: "Faith & Service",
            title: "Missionary Assistance Program",
            purpose: "To provide an opportunity for individuals—who otherwise may not have the opportunity due to financial constraints—to increase their faith and gain leadership, management, and other valuable skills through serving a full-time mission.",
            guidelines: "The award includes the monthly cost of missionary service as determined by the Church of Jesus Christ of Latter-Day Saints, as well as necessary preparation expenses such as clothing and supplies.",
            eligibility: [
                "Individuals preparing for full-time missionary service.",
                "Demonstrated financial need."
            ],
            conditions: [
                "Completion of full missionary term.",
                "Adherence to all standards of the serving organization."
            ]
        },
        job: {
            img: "./images/work.jpg",
            tag: "Career",
            title: "Job Improvement Program",
            purpose: "To promote self-sufficiency by providing financial training and career coaching, helping meet basic needs for short periods so recipients can focus on upskilling.",
            guidelines: "A coach will help determine funds needed for higher education courses, technical training, materials, and living costs to supplement existing earnings.",
            eligibility: [
                "Individuals seeking to improve technical skills and long-term job acquisition.",
                "Willingness to work on a personal budget."
            ],
            conditions: [
                "Active participation in career coaching sessions.",
                "Evidence of enrollment or progress in training."
            ]
        }
    };

    // --- 2. Modal Logic (no blur element) ---
    const modal = document.getElementById('program-modal');
    const modalBody = document.getElementById('modal-body-inject');
    const closeBtn = document.querySelector('.modal-close');
    const applyBtn = document.querySelector('.modal-apply-btn');
    const programRow = document.querySelector('.modal-program-row');

    function openModal(id) {
        const data = programData[id];
        if (!data) return;

        modalBody.innerHTML = `
            <div class="modal-hero" style="margin-bottom:18px;">
                <img src="${data.img}" alt="${data.title}" style="width:100%; height:260px; object-fit:cover; border-radius:8px; border-bottom:2px solid var(--gold);">
            </div>
            <span class="modal-header-tag">${data.tag}</span>
            <h2 class="modal-title">${data.title}</h2>
            <h3 class="modal-section-title">Purpose</h3>
            <p class="modal-text">${data.purpose}</p>
            <h3 class="modal-section-title">General Guidelines</h3>
            <p class="modal-text">${data.guidelines}</p>
            <h3 class="modal-section-title">Criteria & Eligibility</h3>
            <ul class="modal-list">${data.eligibility.map(i => `<li>${i}</li>`).join('')}</ul>
            <h3 class="modal-section-title">Conditions to Maintain</h3>
            <ul class="modal-list">${data.conditions ? data.conditions.map(i => `<li>${i}</li>`).join('') : '<li>Contact us for details.</li>'}</ul>
        `;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
       
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // wire existing Read More links to modal (works with href="#cap" or program-details.html#cap)
    document.querySelectorAll('.luxury-card__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').split('#')[1];
            openModal(id);
        });

        // preload preview image on hover to make modal appear snappier
        link.addEventListener('mouseenter', (e) => {
            const id = (link.getAttribute('href') || '').split('#')[1];
            if (id && programData[id] && programData[id].img) {
                const img = new Image();
                img.src = programData[id].img;
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    if (applyBtn) applyBtn.addEventListener('click', (e) => {
        closeModal();
        setTimeout(() => {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });

   
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // populate modal-program-row with mini cards (side-scroll)
    function populateModalRow() {
        if (!programRow) return;
        programRow.innerHTML = '';
        Object.keys(programData).forEach(key => {
            const d = programData[key];
            const card = document.createElement('div');
            card.className = 'mini-card';
            card.innerHTML = `
                <img src="${d.img}" alt="${d.title}">
                <div class="mini-body">
                    <h4>${d.title}</h4>
                    <p style="margin:0; font-size:0.85rem; color:#bdbdbd;">${d.tag}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(key));
            programRow.appendChild(card);
        });
    }

    populateModalRow(); 

    const nav = document.querySelector('.nav-fixed');
    const navLinks = document.querySelectorAll('.nav-list a');
    const hamburger = document.querySelector('.hamburger');
    const navWrapper = document.querySelector('.nav-pill-wrapper');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }, { passive: true });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navWrapper.classList.toggle('active');
        });
    }

    const triggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -10% 0px" });

    document.querySelectorAll('.fade-up, .split-header, .hero-sub-mask p').forEach(el => triggerObserver.observe(el));

    document.querySelectorAll('.split-header').forEach(header => {
        const text = header.innerText;
        header.innerHTML = text.split('').map((char, i) => 
            `<span style="transition-delay: ${i * 0.02}s">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    });

    // Parallax
    function animateParallax() {
        const scrollY = window.scrollY;
        document.querySelectorAll('.parallax-hero').forEach(img => {
            img.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
        });
        requestAnimationFrame(animateParallax);
    }
    requestAnimationFrame(animateParallax);

    // Values Interaction
    const valueItems = document.querySelectorAll('.value-item');
    const valueDescs = document.querySelectorAll('.value-desc');
    
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const id = item.dataset.id;
            valueItems.forEach(i => i.classList.remove('active'));
            valueDescs.forEach(d => d.classList.remove('active'));
            item.classList.add('active');
            document.querySelector(`.value-desc[data-id="${id}"]`).classList.add('active');
        });
    });
});
