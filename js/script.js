// js/script.js — Coffee & Plant
// Premium interactions & animations
(function () {
  "use strict";

  /* ────────────────────────────────────────────
     PRELOADER
  ──────────────────────────────────────────── */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader) {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            preloader.style.display = "none";
            document.body.style.overflow = "";
            initAnimations();
          },
        });
      } else {
        initAnimations();
      }
    }, 600);
  });

  // prevent scroll during preload
  document.body.style.overflow = "hidden";

  /* ────────────────────────────────────────────
     NAVBAR
  ──────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (navbar) {
      navbar.classList.toggle("scrolled", current > 30);
    }
    lastScroll = current;
  }, { passive: true });

  /* ────────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────────── */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");
  const backdrop = document.querySelector(".mobile-menu-backdrop");

  function openMenu() {
    mobileMenu.classList.add("active");
    menuToggle.classList.add("active");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    mobileMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
  });
  mobileClose?.addEventListener("click", closeMenu);
  backdrop?.addEventListener("click", closeMenu);

  document.querySelectorAll(".mobile-link").forEach((l) =>
    l.addEventListener("click", closeMenu)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ────────────────────────────────────────────
     BACK TO TOP
  ──────────────────────────────────────────── */
  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener("scroll", () => {
      backBtn.classList.toggle("visible", window.scrollY > 450);
    }, { passive: true });
    backBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ────────────────────────────────────────────
     WHATSAPP
  ──────────────────────────────────────────── */
  const WA_NUMBER = "254700000000";
  function openWA(msg) {
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  document.getElementById("waFloat")?.addEventListener("click", (e) => {
    e.preventDefault();
    openWA("Hello Coffee & Plant! I'd love to know more about your menu.");
  });

  document.getElementById("directWaBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openWA("Hello Coffee & Plant! I'd like to get in touch.");
  });

  // Contact form
  const waForm = document.getElementById("whatsappForm");
  if (waForm) {
    waForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("waName")?.value.trim();
      const phone = document.getElementById("waPhone")?.value.trim();
      const subject = document.getElementById("waSubject")?.value;
      const message = document.getElementById("waMessage")?.value.trim();
      const feedback = document.getElementById("waFeedback");

      if (!name || !message) {
        feedback.textContent = "Please fill in your name and message.";
        feedback.className = "form-feedback error";
        return;
      }

      let txt = `Hello Coffee & Plant! 👋\n\nName: ${name}\n`;
      if (phone) txt += `Phone: ${phone}\n`;
      txt += `Subject: ${subject}\n\n${message}`;

      feedback.textContent = "Opening WhatsApp...";
      feedback.className = "form-feedback success";

      setTimeout(() => {
        openWA(txt);
        waForm.reset();
        feedback.textContent = "";
      }, 600);
    });
  }

  /* ────────────────────────────────────────────
     NEWSLETTER
  ──────────────────────────────────────────── */
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const origText = btn.textContent;
      btn.textContent = "✓ Thanks!";
      btn.style.background = "#4a7c5f";
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = "";
        form.reset();
      }, 3000);
    });
  });

  /* ────────────────────────────────────────────
     HORIZONTAL DRAG SCROLL (fan favourites)
  ──────────────────────────────────────────── */
  const fanScroll = document.getElementById("fanScroll");
  if (fanScroll) {
    let isDragging = false, startX, scrollLeft;

    fanScroll.addEventListener("mousedown", (e) => {
      isDragging = true;
      fanScroll.classList.add("dragging");
      startX = e.pageX - fanScroll.offsetLeft;
      scrollLeft = fanScroll.scrollLeft;
    });
    fanScroll.addEventListener("mouseleave", () => {
      isDragging = false;
      fanScroll.classList.remove("dragging");
    });
    fanScroll.addEventListener("mouseup", () => {
      isDragging = false;
      fanScroll.classList.remove("dragging");
    });
    fanScroll.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - fanScroll.offsetLeft;
      fanScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  /* ────────────────────────────────────────────
     MENU DATA & RENDERING (services.html)
  ──────────────────────────────────────────── */
  const menuGrid = document.getElementById("menuGrid");
  if (menuGrid) {
    const menuItems = [
      // Breakfast
      { name: "Plant Powered Breakfast", price: 1400, desc: "Sourdough, crispy tofu, plant cheeze, guacamole", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Mushroom & Spinach Benedict", price: 1400, desc: "Sourdough, wild mushrooms, vegan hollandaise", category: "breakfast", dietary: ["vg"] },
      { name: "Za'atar Turkish Eggs", price: 1400, desc: "Pita, poached eggs, herbed ricotta, za'atar butter", category: "breakfast", dietary: ["d", "eg"] },
      { name: "Overnight Oats", price: 1000, desc: "Coconut mylk, granola, mixed berry compote", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Chia Pudding", price: 1000, desc: "Coconut mylk, house granola, seasonal toppings", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Smoothie Bowl", price: 1050, desc: "Mixed berries, banana, granola, seed cluster", category: "breakfast", dietary: ["vg", "n"] },
      // Bowls
      { name: "Quinoa Buddha Bowl", price: 1450, desc: "Roasted veggies, avocado, seeds, olive oil dressing", category: "bowls", dietary: ["vg", "gf"] },
      { name: "Moroccan Buddha Bowl", price: 1450, desc: "Quinoa, chickpeas, red cabbage, pickled eggplant, hummus", category: "bowls", dietary: ["vg", "gf"] },
      { name: "Asian Buddha Bowl", price: 1200, desc: "Teriyaki tofu, rice noodles, Thai papaya salad, peanuts", category: "bowls", dietary: ["vg", "n", "sy"] },
      { name: "Mediterranean Bowl", price: 1450, desc: "Chickpea patty, hummus, parsley salad, green tahini, pita", category: "bowls", dietary: ["vg"] },
      { name: "Soba Noodles & Tofu Bowl", price: 1500, desc: "Soba noodles, peanut sauce, pan-fried tofu, daikon", category: "bowls", dietary: ["vg", "sy"] },
      { name: "Mexican Bowl", price: 1450, desc: "Black beans, corn, quinoa, tortilla chips, guacamole, salsa", category: "bowls", dietary: ["vg"] },
      // Sandwiches
      { name: "Bombay Sandwich", price: 1350, desc: "Sourdough, crunchy veggies, pod mozzarella, mint chutney", category: "sandwiches", dietary: ["vg", "n"] },
      { name: "Grilled Veggie Sandwich", price: 1000, desc: "Sourdough, eggplant, courgette, carrots, spicy mayo", category: "sandwiches", dietary: ["vg"] },
      { name: "Cheddar & Carrot Chutney", price: 1200, desc: "Sourdough, spinach, carrot chutney, aged cheddar", category: "sandwiches", dietary: ["d"] },
      { name: "Tofu Sando", price: 1450, desc: "Ciabatta, crispy tofu, pickles, spicy mayo, side salad", category: "sandwiches", dietary: ["vg", "sy"] },
      { name: "Oyster Mushroom Sando", price: 1450, desc: "Ciabatta, battered mushroom, coleslaw, dill mayo", category: "sandwiches", dietary: ["vg"] },
      { name: "Korean BBQ Sando", price: 1650, desc: "Ciabatta, oyster mushrooms, Korean BBQ sauce, kimchi", category: "sandwiches", dietary: ["vg"] },
      // Pizza
      { name: "Margherita", price: 1200, desc: "San Marzano tomato, mozzarella, fresh basil, garlic confit", category: "pizza", dietary: [] },
      { name: "Wild Mushroom", price: 1600, desc: "Gremolata base, wild mushrooms, plant mozzarella", category: "pizza", dietary: [] },
      { name: "Verdura", price: 1400, desc: "Tomato, roasted mushroom, bell peppers, plant mozzarella", category: "pizza", dietary: [] },
      { name: "Pesto Genovese", price: 1600, desc: "Pesto base, red onion, cherry tomato, mozzarella", category: "pizza", dietary: ["n"] },
      { name: "Burrata & Marinated Tomatoes", price: 1700, desc: "Plant burrata, slow-marinated heirloom tomatoes", category: "pizza", dietary: ["d"] },
      { name: "Chilli Cheese", price: 1300, desc: "Pickled chillies, cherry tomatoes, plant mozzarella", category: "pizza", dietary: [] },
      // Pasta
      { name: "Pesto Pasta", price: 1150, desc: "Penne, house-made green pesto, pine nuts", category: "pasta", dietary: ["vg", "n"] },
      { name: "Pasta Arrabbiata", price: 1000, desc: "Penne, spiced tomato ragu, chilli, herbs", category: "pasta", dietary: ["vg"] },
      { name: "Mushroom White Sauce Pasta", price: 1300, desc: "Tagliatelle, roasted mushrooms, cashew cream sauce", category: "pasta", dietary: ["d"] },
      // Drinks
      { name: "Anti-Inflammatory Beet", price: 750, desc: "Berry, beetroot, ginger, orange, turmeric", category: "drinks", dietary: ["vg"] },
      { name: "Green Detox", price: 750, desc: "Cucumber, apple, kale, lemon, ginger", category: "drinks", dietary: ["vg"] },
      { name: "Mixed Berry Banana", price: 750, desc: "Banana, strawberry, blueberry, yoghurt, honey", category: "drinks", dietary: ["d"] },
      { name: "Fresh Orange Juice", price: 600, desc: "Cold-pressed, freshly squeezed daily", category: "drinks", dietary: ["vg"] },
      { name: "Dawa", price: 380, desc: "Fresh ginger, honey, lemon — warming & classic", category: "drinks", dietary: [] },
      { name: "Iced Mint Frappuccino", price: 650, desc: "Espresso, mint, blended over ice", category: "drinks", dietary: [] },
      // POD Mylks & Cheeze
      { name: "Oat Mylk 500ml", price: 350, desc: "Oats, filtered water, vanilla, sea salt", category: "plantbased", dietary: ["vg"] },
      { name: "Almond Mylk 500ml", price: 550, desc: "Almonds, filtered water, dates, vanilla", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Cashew Mylk 500ml", price: 550, desc: "Cashews, filtered water, dates, vanilla", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Coconut Mylk 500ml", price: 350, desc: "Fresh coconut, filtered water", category: "plantbased", dietary: ["vg"] },
      { name: "Cashew Butter 200g", price: 725, desc: "Cultured cashew, coconut oil, olive oil, sea salt", category: "plantbased", dietary: ["vg"] },
      { name: "Plant Mozzarella 160g", price: 400, desc: "Cashew, peanuts, tapioca — melts beautifully", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Soft Cheeze Original 200g", price: 550, desc: "Cultured cashew, sea salt — tangy and spreadable", category: "plantbased", dietary: ["vg"] },
      { name: "Za'atar Cheeze 200g", price: 750, desc: "Cultured cashew with house-blended za'atar", category: "plantbased", dietary: ["vg"] },
      { name: "White Truffle Cheeze 200g", price: 850, desc: "Cultured cashew, white truffle oil — deeply savoury", category: "plantbased", dietary: ["vg"] },
      { name: "Smoked Paprika Cheeze 200g", price: 850, desc: "Cultured cashew, smoked paprika crust", category: "plantbased", dietary: ["vg"] },
      // Small Bites
      { name: "Tomato Soup + Garlic Bread", price: 500, desc: "Slow-roasted tomato, sourdough garlic bread", category: "smallbites", dietary: ["vg"] },
      { name: "Mushroom Soup + Toast", price: 650, desc: "Creamy forest mushroom, sourdough toast", category: "smallbites", dietary: ["vg"] },
      { name: "Oyster Mushroom Nuggets", price: 1000, desc: "Crispy battered, house-made dill mayo", category: "smallbites", dietary: ["vg"] },
      { name: "Jalapeño Poppers", price: 1250, desc: "Filled with plant cheeze, seasoned chipotle mayo", category: "smallbites", dietary: ["vg"] },
      { name: "Hummus & Pita", price: 1000, desc: "Classic tahini hummus, warm house pita", category: "smallbites", dietary: ["vg"] },
      { name: "Harissa Fries", price: 850, desc: "Crispy fries, house harissa, herbs", category: "smallbites", dietary: ["vg"] },
      // Pancakes
      { name: "Plain Pancakes", price: 800, desc: "Fluffy stack, maple syrup, fresh fruit", category: "pancakes", dietary: ["eg"] },
      { name: "Blueberry Pancake", price: 1000, desc: "Blueberry compote, maple syrup, coconut cream", category: "pancakes", dietary: ["eg"] },
      { name: "Sweet Buckwheat Crepe", price: 850, desc: "Gluten-free, homemade orange compote", category: "pancakes", dietary: ["vg", "gf"] },
      { name: "Savoury Buckwheat Crepe", price: 1200, desc: "Gluten-free, wild mushroom, caramelised onions", category: "pancakes", dietary: ["vg", "gf"] },
      { name: "Waffles", price: 800, desc: "Blueberry compote, maple syrup, plant butter", category: "pancakes", dietary: ["eg"] },
      { name: "Potato Waffles", price: 1350, desc: "Butter beans, pickles, house chilli mayo", category: "pancakes", dietary: ["vg"] },
    ];

    const noResults = document.getElementById("noResults");

    const dietLabels = {
      vg: { label: "Vegan", icon: "🌱" },
      d: { label: "Dairy", icon: "🥛" },
      n: { label: "Nuts", icon: "🥜" },
      gf: { label: "GF", icon: "🌾" },
      sy: { label: "Soy", icon: "🫘" },
      eg: { label: "Egg", icon: "🥚" },
    };

    function renderMenu(filter = "all") {
      const items = filter === "all" ? menuItems : menuItems.filter((i) => i.category === filter);

      if (items.length === 0) {
        menuGrid.innerHTML = "";
        noResults.style.display = "block";
        return;
      }
      noResults.style.display = "none";

      menuGrid.innerHTML = items
        .map(
          (item) => `
        <div class="menu-card">
          <div class="menu-card-top">
            <h3 class="item-name">${item.name}</h3>
            <span class="item-price">Ksh ${item.price.toLocaleString()}</span>
          </div>
          <p class="item-desc">${item.desc}</p>
          <div class="dietary">
            ${item.dietary
              .map((d) => {
                const dl = dietLabels[d] || { label: d, icon: "" };
                return `<span class="diet-badge">${dl.icon} ${dl.label}</span>`;
              })
              .join("")}
          </div>
        </div>`
        )
        .join("");

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          ".menu-card",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.025, duration: 0.45, ease: "power2.out" }
        );
      }
    }

    renderMenu("all");

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.dataset.filter);
      });
    });

    document.getElementById("filterReset")?.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      document.querySelector('[data-filter="all"]')?.classList.add("active");
      renderMenu("all");
    });
  }

  /* ────────────────────────────────────────────
     GSAP ANIMATIONS
  ──────────────────────────────────────────── */
  function initAnimations() {
    if (typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero entrance
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      gsap.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" });
      gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1.1, delay: 0.15, ease: "power4.out" });
      gsap.from(".hero-desc", { y: 30, opacity: 0, duration: 0.9, delay: 0.35, ease: "power2.out" });
      gsap.from(".hero-actions .btn", { y: 20, opacity: 0, stagger: 0.12, delay: 0.5, duration: 0.8, ease: "power2.out" });
      gsap.from(".hero-scroll", { opacity: 0, duration: 1, delay: 1.2 });
    }

    // Hero parallax
    const heroBg = document.getElementById("heroImg");
    if (heroBg && typeof ScrollTrigger !== "undefined") {
      gsap.to(heroBg, {
        scrollTrigger: {
          trigger: ".hero-home",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
        y: "25%",
        ease: "none",
      });
    }

    // Page hero entrance
    const pageHero = document.querySelector(".page-hero-content");
    if (pageHero) {
      gsap.from(".page-hero-content > *", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power2.out",
      });
    }

    // Generic scroll-reveal for [data-anim]
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray("[data-anim]").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i % 3 === 0 ? 0 : (i % 3) * 0.08,
          ease: "power2.out",
        });
      });

      // Feature items stagger
      gsap.utils.toArray(".feature-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: ".features-strip", start: "top 85%", once: true },
          y: 30,
          opacity: 0,
          delay: i * 0.12,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      // Pods stagger
      gsap.utils.toArray(".pod-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          y: 50,
          opacity: 0,
          delay: i * 0.1,
          duration: 0.9,
          ease: "power2.out",
        });
      });

      // Fan cards slide in
      if (document.getElementById("fanScroll")) {
        gsap.from("#fanTrack", {
          scrollTrigger: { trigger: "#fanScroll", start: "top 85%", once: true },
          x: 80,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      }

      // Value / Team cards
      gsap.utils.toArray(".value-card, .team-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          y: 40,
          opacity: 0,
          delay: (i % 3) * 0.1,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      // Story stats counter
      gsap.utils.toArray(".stat-num, .story-stat-num").forEach((el) => {
        const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ""));
        if (!isNaN(target) && target > 0) {
          const suffix = el.textContent.replace(/[0-9.]/g, "");
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            textContent: 0,
            duration: 1.4,
            ease: "power1.out",
            snap: { textContent: target >= 100 ? 1 : 0.1 },
            onUpdate: function () {
              const val = parseFloat(this.targets()[0].textContent);
              el.textContent = (target >= 100 ? Math.round(val) : val.toFixed(0)) + suffix;
            },
          });
        }
      });
    }
  }

})();
