/**
 * ============================================================================
 * KAROLINA CEGLAREK – FLORYSTYKA | GŁÓWNY SKRYPT ATELIER (VANILLA JS)
 * ============================================================================
 */

/* ============================================================================
   1. OBIEKT KONFIGURACYJNY DANYCH KONTAKTOWYCH (DO ŁATWEJ PODMIANY)
   ============================================================================ */
const CONTACT_CONFIG = {
  telefon: "+48 000 000 000",
  email: "kontakt@example.pl",
  whatsapp: "48000000000",
  instagram: "#",
  facebook: "#",
  tiktok: "#"
};

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initContactLinks();
  initTheme();
  initIntroAnimation(prefersReducedMotion);
  initNavigation();
  initSmoothScroll();
  initPageTransitions(prefersReducedMotion);
  initScrollReveal();
  initSequentialFlowTimeline();
  initPortfolioLightbox();
  initHeroParallaxAndMagnetic(prefersReducedMotion);
  initPetalsCanvas(prefersReducedMotion);
  initCustomCursor(prefersReducedMotion);
  updateFooterYear();
});

/* ============================================================================
   2. WSTRZYKIWANIE DANYCH KONTAKTOWYCH I SOCIAL MEDIÓW W STOPCE
   ============================================================================ */
function initContactLinks() {
  const cleanPhone = CONTACT_CONFIG.telefon.replace(/\s+/g, "");

  document.querySelectorAll("[data-contact-type]").forEach((link) => {
    const type = link.getAttribute("data-contact-type");
    switch (type) {
      case "telefon":
        link.href = `tel:${cleanPhone}`;
        break;
      case "email":
        link.href = `mailto:${CONTACT_CONFIG.email}`;
        break;
      case "whatsapp":
        link.href = `https://wa.me/${CONTACT_CONFIG.whatsapp.replace(/\D/g, "")}`;
        break;
      case "instagram":
        link.href = CONTACT_CONFIG.instagram;
        break;
      case "facebook":
        link.href = CONTACT_CONFIG.facebook;
        break;
      case "tiktok":
        link.href = CONTACT_CONFIG.tiktok;
        break;
    }
  });

  document.querySelectorAll('[data-contact-label="telefon"]').forEach((el) => {
    el.textContent = CONTACT_CONFIG.telefon;
  });

  document.querySelectorAll('[data-contact-label="email"]').forEach((el) => {
    el.textContent = CONTACT_CONFIG.email;
  });
}

/* ============================================================================
   3. OBSŁUGA DWÓCH MOTYWÓW (JASNY BLUSH / CIEMNY VELVET)
   ============================================================================ */
function initTheme() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggleBtn");

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("kc_theme");
  } catch (e) {
    /* Ignoruj błędy localStorage */
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  } else {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", systemDark ? "dark" : "light");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);

      try {
        localStorage.setItem("kc_theme", nextTheme);
      } catch (e) {
        /* Brak zapisu */
      }
    });
  }
}

/* ============================================================================
   4. PROFESJONALNA ANIMACJA WEJŚCIA (ATELIER INTRO – RAZ NA SESJĘ)
   ============================================================================ */
function initIntroAnimation(prefersReducedMotion) {
  const introOverlay = document.getElementById("introOverlay");
  if (!introOverlay) return;

  const introTitle = document.getElementById("introTitle");
  const skipBtn = document.getElementById("introSkipBtn");

  let introSeen = false;
  try {
    introSeen = sessionStorage.getItem("kc_intro_seen") === "true";
  } catch (e) {
    introSeen = false;
  }

  if (introSeen || prefersReducedMotion) {
    introOverlay.classList.add("is-hidden");
    document.body.classList.add("intro-complete");
    return;
  }

  document.body.classList.add("intro-active");

  if (introTitle) {
    const text = introTitle.textContent.trim();
    introTitle.textContent = "";
    [...text].forEach((char, idx) => {
      const span = document.createElement("span");
      span.className = "intro-char";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${0.35 + idx * 0.042}s`;
      introTitle.appendChild(span);
    });
  }

  requestAnimationFrame(() => {
    introOverlay.classList.add("is-playing");
  });

  let splitTimeout;
  let hideTimeout;

  const finishIntro = () => {
    clearTimeout(splitTimeout);
    clearTimeout(hideTimeout);

    introOverlay.classList.add("is-splitting");
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-complete");

    try {
      sessionStorage.setItem("kc_intro_seen", "true");
    } catch (e) {
      /* Ignoruj wyjątek */
    }

    hideTimeout = setTimeout(() => {
      introOverlay.classList.add("is-hidden");
    }, 1250);
  };

  splitTimeout = setTimeout(finishIntro, 2850);

  if (skipBtn) {
    skipBtn.addEventListener("click", finishIntro);
  }
}

/* ============================================================================
   5. NAWIGACJA I MENU MOBILNE
   ============================================================================ */
function initNavigation() {
  const header = document.getElementById("siteHeader");
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileBackdrop = document.getElementById("mobileMenuBackdrop");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    if (header) {
      if (currentY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

      if (currentY > 140 && currentY > lastScrollY && (!mobileMenu || !mobileMenu.classList.contains("is-open"))) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }
    }

    lastScrollY = currentY;
  }, { passive: true });

  if (!burgerBtn || !mobileMenu) return;

  const toggleMenu = (forceState) => {
    const isOpen = typeof forceState === "boolean" ? forceState : !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", isOpen);
    burgerBtn.classList.toggle("is-active", isOpen);
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  burgerBtn.addEventListener("click", () => toggleMenu());
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", () => toggleMenu(false));
  mobileLinks.forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      toggleMenu(false);
    }
  });
}

/* ============================================================================
   6. PŁYNNY SCROLL DO SEKCJI #KONTAKT
   ============================================================================ */
function initSmoothScroll() {
  const triggers = document.querySelectorAll(".js-scroll-trigger, a[href='#kontakt']");

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollTo = (targetEl, duration = 950) => {
    const startY = window.scrollY;
    const targetY = targetEl.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    let startTime = null;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const href = trigger.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target);
        }
      }
    });
  });
}

/* ============================================================================
   7. PŁYNNE PRZEJŚCIA MIĘDZY PODSTRONAMI
   ============================================================================ */
function initPageTransitions(prefersReducedMotion) {
  const transitionEl = document.getElementById("pageTransition");
  if (!transitionEl || prefersReducedMotion) return;

  window.addEventListener("pageshow", () => {
    transitionEl.classList.remove("is-active");
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:") ||
      link.target === "_blank"
    ) {
      return;
    }

    link.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      transitionEl.classList.add("is-active");
      setTimeout(() => {
        window.location.href = href;
      }, 360);
    });
  });
}

/* ============================================================================
   8. INTERSECTION OBSERVER – ANIMACJE POJAWIANIA SIĘ
   ============================================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================================================
   9. SEKWENCYJNA ANIMACJA OSI CZASU W OMNIE.HTML (RYSOWANIE LINII PRZY SCROLLU)
   ============================================================================ */
function initSequentialFlowTimeline() {
  const timeline = document.getElementById("flowTimeline");
  const spineFill = document.getElementById("flowSpineFill");
  const steps = document.querySelectorAll(".flow-step");

  if (!timeline || !spineFill || !steps.length) return;

  const updateTimelineOnScroll = () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.68;

    // Oblicz postęp rysowania pionowej złotej linii (0 -> 1)
    const rawProgress = (triggerPoint - rect.top) / rect.height;
    const progress = Math.max(0, Math.min(1, rawProgress));
    spineFill.style.transform = `scaleY(${progress})`;

    // Aktywuj kolejne kroki sekwencyjnie, gdy linia do nich dociera
    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < triggerPoint) {
        step.classList.add("is-active");
      } else {
        step.classList.remove("is-active");
      }
    });
  };

  window.addEventListener("scroll", updateTimelineOnScroll, { passive: true });
  window.addEventListener("resize", updateTimelineOnScroll, { passive: true });
  updateTimelineOnScroll();
}

/* ============================================================================
   10. LIGHTBOX W PORTFOLIO.HTML
   ============================================================================ */
function initPortfolioLightbox() {
  const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));
  const lightbox = document.getElementById("lightbox");
  if (!lightbox || !portfolioItems.length) return;

  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const backdrop = document.getElementById("lightboxBackdrop");

  let currentIndex = 0;

  const updateLightboxContent = (item) => {
    const img = item.querySelector("img");
    const cat = item.querySelector(".badge-category");
    const title = item.querySelector(".badge-title");

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (cat && lightboxCategory) lightboxCategory.textContent = cat.textContent;
    if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;
  };

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxContent(portfolioItems[currentIndex]);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const navigateLightbox = (direction) => {
    currentIndex = (currentIndex + direction + portfolioItems.length) % portfolioItems.length;
    updateLightboxContent(portfolioItems[currentIndex]);
  };

  portfolioItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateLightbox(1));

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

/* ============================================================================
   11. PARALLAX W HERO I MAGNETYCZNY EFEKT PRZYCISKÓW
   ============================================================================ */
function initHeroParallaxAndMagnetic(prefersReducedMotion) {
  if (prefersReducedMotion || window.innerWidth < 901) return;

  const parallaxImgs = document.querySelectorAll(".parallax-img");
  if (parallaxImgs.length) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      parallaxImgs.forEach((img) => {
        img.style.transform = `scale(1.08) translate3d(${x}px, ${y}px, 0)`;
      });
    }, { passive: true });
  }

  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.22;
      const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.22;
      btn.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.04)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ============================================================================
   12. SUBTELNE PŁATKI W TLE (CANVAS) I KURSOR DESKTOPOWY
   ============================================================================ */
function initPetalsCanvas(prefersReducedMotion) {
  const canvas = document.getElementById("petalsCanvas");
  if (!canvas || prefersReducedMotion || window.innerWidth < 600) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const petals = Array.from({ length: 12 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 3 + Math.random() * 4,
    speedY: 0.22 + Math.random() * 0.4,
    speedX: -0.2 + Math.random() * 0.4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.01
  }));

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const render = () => {
    if (!document.hidden) {
      ctx.clearRect(0, 0, width, height);
      const petalColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--petal-color")
        .trim() || "rgba(200, 136, 149, 0.22)";

      ctx.fillStyle = petalColor;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.2;
        p.angle += p.spin;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

function initCustomCursor(prefersReducedMotion) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (!dot || !ring || prefersReducedMotion || window.innerWidth < 1025) return;

  window.addEventListener("mousemove", (e) => {
    dot.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
    ring.style.transform = `translate3d(${e.clientX - 17}px, ${e.clientY - 17}px, 0)`;
  }, { passive: true });

  document.querySelectorAll("a, button, .portfolio-item").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

function updateFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}