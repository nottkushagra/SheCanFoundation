document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  // Theme Switcher
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Mobile Menu
  const toggleMobileMenu = () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Sticky Header & Active Links
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  const sections = document.querySelectorAll("section");
  const updateActiveLink = () => {
    let scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const id = section.getAttribute("id");
      if (!id) return;
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}` || link.getAttribute("href") === `index.html#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);

  // Confetti Effect
  const triggerConfetti = () => {
    const colors = ["#ed0707", "#673de6", "#ffcd35", "#00b090", "#357df9"];
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = Math.random() * 8 + 6 + "px";
      piece.style.height = piece.style.width;
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.animationDuration = Math.random() * 1.5 + 1.2 + "s";
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  };

  // Contact Form Validation
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("user-name");
      const emailInput = document.getElementById("user-email");
      const messageInput = document.getElementById("user-message");

      let isValid = true;

      [nameInput, emailInput, messageInput].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = "var(--primary-color)";
          isValid = false;
        } else {
          input.style.borderColor = "rgba(255, 255, 255, 0.15)";
        }
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
        emailInput.style.borderColor = "var(--primary-color)";
        isValid = false;
      }

      if (isValid) {
        formSuccess.style.display = "block";
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
        triggerConfetti();
        contactForm.reset();
        setTimeout(() => {
          formSuccess.style.display = "none";
        }, 5000);
      }
    });

    const inputs = contactForm.querySelectorAll(".form-control");
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.style.borderColor = "rgba(255, 255, 255, 0.15)";
        }
      });
    });
  }

  // Stats Count-Up
  const stats = document.querySelectorAll(".stat-num");
  const countUp = (element) => {
    const target = +element.getAttribute("data-target");
    const suffix = element.getAttribute("data-suffix") || "";
    const increment = target / 200;

    let current = 0;
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
        setTimeout(updateNumber, 10);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };
    updateNumber();
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));

  // Testimonial Slider
  const slides = document.querySelectorAll(".quote-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  if (slides.length) {
    const showSlide = (index) => {
      slides.forEach(s => s.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      currentSlide = index;
    };

    prevBtn?.addEventListener("click", () => {
      let idx = currentSlide - 1;
      if (idx < 0) idx = slides.length - 1;
      showSlide(idx);
    });

    nextBtn?.addEventListener("click", () => {
      let idx = currentSlide + 1;
      if (idx >= slides.length) idx = 0;
      showSlide(idx);
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => showSlide(idx));
    });

    setInterval(() => {
      let idx = currentSlide + 1;
      if (idx >= slides.length) idx = 0;
      showSlide(idx);
    }, 7000);
  }

  // FAQ Accordion
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("active");
        const span = i.querySelector(".faq-trigger span");
        if (span) span.textContent = "+";
      });

      if (!isActive) {
        item.classList.add("active");
        const span = trigger.querySelector("span");
        if (span) span.textContent = "−";
      }
    });
  });

  // Impact Range Slider
  const directSlider = document.getElementById("direct-amount-slider");
  const directValText = document.getElementById("direct-slider-val");
  const directImpactText = document.getElementById("direct-impact-desc");

  if (directSlider && directValText && directImpactText) {
    const updateCalculator = (val) => {
      directValText.textContent = `₹${val}`;
      const girlsCount = Math.floor(val / 100);
      if (girlsCount <= 0) {
        directImpactText.textContent = "💡 Every contribution helps purchase basic hygiene kits!";
      } else {
        directImpactText.textContent = `💡 This provides ${girlsCount} girls with sanitary pads and awareness kits for a full month!`;
      }
    };

    directSlider.addEventListener("input", (e) => {
      updateCalculator(e.target.value);
    });

    updateCalculator(directSlider.value);
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll(
    ".hero-content, .hero-image-wrapper, .stat-card, .about-image-wrapper, .about-content, .feature-box, .activity-content, .activity-image-wrapper, .initiative-card, .faq-item, .form-card"
  );

  revealElements.forEach(el => el.classList.add("scroll-reveal"));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Donation Page Interactions
  const tierCards = document.querySelectorAll(".tier-card");
  const donorAmountInput = document.getElementById("donor-amount");
  const donationForm = document.getElementById("donation-form");
  const paymentSuccess = document.getElementById("payment-success");

  if (tierCards.length && donorAmountInput) {
    tierCards.forEach(card => {
      card.addEventListener("click", () => {
        tierCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        donorAmountInput.value = card.getAttribute("data-amount");
        donorAmountInput.style.borderColor = "var(--border-color)";
      });
    });

    donorAmountInput.addEventListener("input", () => {
      tierCards.forEach(c => c.classList.remove("selected"));
    });
  }

  if (donationForm) {
    donationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const donorName = document.getElementById("donor-name");
      const donorEmail = document.getElementById("donor-email");
      const donorAmount = document.getElementById("donor-amount");

      let isValid = true;

      [donorName, donorEmail, donorAmount].forEach(input => {
        if (!input.value.trim() || (input.type === "number" && parseFloat(input.value) <= 0)) {
          input.style.borderColor = "var(--primary-color)";
          isValid = false;
        } else {
          input.style.borderColor = "var(--border-color)";
        }
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (donorEmail.value.trim() && !emailRegex.test(donorEmail.value.trim())) {
        donorEmail.style.borderColor = "var(--primary-color)";
        isValid = false;
      }

      if (isValid) {
        paymentSuccess.style.display = "block";
        paymentSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
        triggerConfetti();
        donationForm.reset();
        tierCards.forEach(c => c.classList.remove("selected"));
        setTimeout(() => {
          paymentSuccess.style.display = "none";
        }, 6000);
      }
    });

    const donationInputs = donationForm.querySelectorAll(".form-control");
    donationInputs.forEach(input => {
      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.style.borderColor = "var(--border-color)";
        }
      });
    });
  }

  // Certificate Image Zoom Modal
  const certImg = document.getElementById("cert-img");
  const zoomModal = document.getElementById("zoom-modal");

  if (certImg && zoomModal) {
    certImg.addEventListener("click", () => {
      zoomModal.style.display = "flex";
      zoomModal.setAttribute("aria-hidden", "false");
    });

    zoomModal.addEventListener("click", () => {
      zoomModal.style.display = "none";
      zoomModal.setAttribute("aria-hidden", "true");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && zoomModal.style.display === "flex") {
        zoomModal.style.display = "none";
        zoomModal.setAttribute("aria-hidden", "true");
      }
    });
  }
});
