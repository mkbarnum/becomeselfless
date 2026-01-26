document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     1) HERO: change only on visit/reload (no slideshow)
     ========================= */
  const heroLayers = Array.from(document.querySelectorAll(".hero-bg-layer"));
  if (heroLayers.length) {
    heroLayers.forEach((img) => img.classList.remove("visible"));
    const chosenIndex = Math.floor(Math.random() * heroLayers.length);
    requestAnimationFrame(() => heroLayers[chosenIndex].classList.add("visible"));
  }

  /* =========================
     2) Program modal (kept from your original)
     ========================= */
  const programData = {
    cap: {
      img: "./images/students.jpg",
      tag: "Education",
      title: "College Assistance Program (CAP)",
      purpose:
        "The purpose of the College Assistance Program (CAP) is to help guide individuals to lifelong self-sufficiency by providing supplemental funds to attend a 4-year university as well as by providing individualized career coaching and training for financial literacy and life skills.",
      guidelines:
        "This is not a traditional scholarship program. SELFLESS does not award predetermined amounts. Recipients meet with a coach to determine the amount awarded based on personal needs. We strongly encourage recipients to attend BYU (Provo or Rexburg).",
      eligibility: [
        "Must have graduated high school, or be on track to graduate.",
        "Must demonstrate community involvement and academic improvement.",
        "Must have a strong desire to attend college.",
      ],
      conditions: [
        "Maintain a 3.0 GPA.",
        "Enroll in a minimum of 14 credit hours per semester.",
        "Apply for FAFSA each year.",
        "Maintain a budget with your assigned coach.",
        "Encouraged to work 8-10 hours a week.",
      ],
    },
    missionary: {
      img: "./images/missionary.jpg",
      tag: "Faith & Service",
      title: "Missionary Assistance Program",
      purpose:
        "To provide an opportunity for individuals—who otherwise may not have the opportunity due to financial constraints—to increase their faith and gain leadership, management, and other valuable skills through serving a full-time mission.",
      guidelines:
        "The award includes the monthly cost of missionary service as determined by the Church of Jesus Christ of Latter-Day Saints, as well as necessary preparation expenses such as clothing and supplies.",
      eligibility: ["Individuals preparing for full-time missionary service.", "Demonstrated financial need."],
      conditions: ["Completion of full missionary term.", "Adherence to all standards of the serving organization."],
    },
    job: {
      img: "./images/work.jpg",
      tag: "Career",
      title: "Job Improvement Program",
      purpose:
        "To promote self-sufficiency by providing financial training and career coaching, helping meet basic needs for short periods so recipients can focus on upskilling.",
      guidelines:
        "A coach will help determine funds needed for higher education courses, technical training, materials, and living costs to supplement existing earnings.",
      eligibility: [
        "Individuals seeking to improve technical skills and long-term job acquisition.",
        "Willingness to work on a personal budget.",
      ],
      conditions: ["Active participation in career coaching sessions.", "Evidence of enrollment or progress in training."],
    },
  };

  const modal = document.getElementById("program-modal");
  const modalBody = document.getElementById("modal-body-inject");
  const closeBtn = document.querySelector(".modal-close");
  const applyBtn = document.querySelector(".modal-apply-btn");
  const programRow = document.querySelector(".modal-program-row");

  function openModal(id) {
    const data = programData[id];
    if (!data || !modal || !modalBody) return;

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
      <ul class="modal-list">${data.eligibility.map((i) => `<li>${i}</li>`).join("")}</ul>
      <h3 class="modal-section-title">Conditions to Maintain</h3>
      <ul class="modal-list">${(data.conditions || []).map((i) => `<li>${i}</li>`).join("")}</ul>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn?.focus?.();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".luxury-card__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = (link.getAttribute("href") || "").split("#")[1];
      openModal(id);
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  applyBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 200);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("active")) closeModal();
  });

  function populateModalRow() {
    if (!programRow) return;
    programRow.innerHTML = "";
    Object.keys(programData).forEach((key) => {
      const d = programData[key];
      const card = document.createElement("div");
      card.className = "mini-card";
      card.innerHTML = `
        <img src="${d.img}" alt="${d.title}">
        <div class="mini-body">
          <h4>${d.title}</h4>
          <p style="margin:0; font-size:0.85rem; color:#bdbdbd;">${d.tag}</p>
        </div>
      `;
      card.addEventListener("click", () => openModal(key));
      programRow.appendChild(card);
    });
  }
  populateModalRow();

  /* =========================
     3) Nav + hamburger
     ========================= */
  const nav = document.querySelector(".nav-fixed");
  const hamburger = document.querySelector(".hamburger");
  const navWrapper = document.querySelector(".nav-pill-wrapper");

  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 80) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navWrapper?.classList.toggle("active");
    const expanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  // Close menu after clicking nav links on mobile
  navWrapper?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove("active");
        navWrapper.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* =========================
     4) Intersection Observer animations
     ========================= */
  const triggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-up, .hero-sub-mask p, .split-header").forEach((el) => triggerObserver.observe(el));

  /* =========================
     5) Split animation ONLY where data-split="true"
     ========================= */
  document.querySelectorAll('.split-header[data-split="true"]').forEach((header) => {
    const text = header.textContent || "";
    header.innerHTML = text
      .split("")
      .map((char, i) => `<span style="transition-delay:${i * 0.02}s">${char}</span>`)
      .join("");
  });

  /* =========================
     6) Core Values hover (desktop only) — fixed and smooth
     ========================= */
  const valueItems = Array.from(document.querySelectorAll(".value-item"));
  const valueDescs = Array.from(document.querySelectorAll(".value-desc"));
  const descWrap = document.getElementById("valuesDescriptions");

  function setDescWrapHeight() {
    // Only needed on desktop where we use absolute desc
    if (!descWrap || window.innerWidth <= 1024) return;

    // Temporarily show all to measure maximum height
    const prev = valueDescs.map((d) => d.classList.contains("active"));
    valueDescs.forEach((d) => d.classList.add("active"));

    const maxH = Math.max(...valueDescs.map((d) => d.getBoundingClientRect().height));
    descWrap.style.minHeight = `${Math.ceil(maxH)}px`;

    // Restore active state
    valueDescs.forEach((d, idx) => d.classList.toggle("active", prev[idx]));
  }

  function activateValue(id) {
    if (window.innerWidth <= 1024) return; // mobile uses stacked layout

    valueItems.forEach((i) => i.classList.toggle("active", i.dataset.id === id));
    valueDescs.forEach((d) => d.classList.toggle("active", d.dataset.id === id));
  }

  if (valueItems.length && valueDescs.length) {
    setDescWrapHeight();

    valueItems.forEach((item) => {
      item.addEventListener("mouseenter", () => activateValue(item.dataset.id));
      item.addEventListener("focus", () => activateValue(item.dataset.id));
    });

    window.addEventListener("resize", () => setDescWrapHeight());
  }
});
