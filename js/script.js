// js/script.js — Coffee & Plant
// Premium interactions & animations
(function () {
  "use strict";

  /* ────────────────────────────────────────────
     PRELOADER — Curtain reveal
  ──────────────────────────────────────────── */
    /* ────────────────────────────────────────────
     PRELOADER — Single-loop state machine (slower)
  ──────────────────────────────────────────── */
  var preloader = document.getElementById("preloader");
  var plNum = document.getElementById("plNum");
  var plLine = document.getElementById("plLine");
  var plFill = document.getElementById("plFill");
  var plBrand = document.getElementById("plBrand");
  var CIRC = 2 * Math.PI * 52;

  document.body.style.overflow = "hidden";

  // Split brand into animated chars
  if (plBrand) {
    var raw = plBrand.textContent;
    plBrand.innerHTML = raw
      .split("")
      .map(function (c, i) {
        var ch = c === " " ? "&nbsp;" : c;
        return (
          '<span class="pl-char" style="animation-delay:' +
          (i * 0.05 + 0.35) +
          's"><span class="pl-char-in">' +
          ch +
          "</span></span>"
        );
      })
      .join("");
  }

  // Init SVG circle
  if (plFill) {
    plFill.style.strokeDasharray = CIRC;
    plFill.style.strokeDashoffset = CIRC;
  }

  // Update progress UI
  function setProgress(val) {
    if (plNum) plNum.textContent = Math.round(val);
    if (plLine) plLine.style.width = val + "%";
    if (plFill) {
      plFill.style.strokeDashoffset = CIRC - (val / 100) * CIRC;
    }
  }

  // ── Timing knobs ──
  var PL_LOAD_DURATION  = 3000;  // 0→88% over 3 seconds
  var PL_MIN_PAUSE      = 1200;  // hold at 88% for at least 1.2s
  var PL_FINISH_DURATION = 500;  // 88→100% over 0.5s

  // ── State machine ──
  var pl = {
    phase: "loading",       // loading → pausing → finishing → done
    current: 0,
    startFrom: 0,
    startTime: performance.now(),
    pauseStart: 0,
    pageReady: false,
    rafId: null,
  };

  function plTick() {
    var now = performance.now();
    var elapsed = now - pl.startTime;

    if (pl.phase === "loading") {
      // Ease-out crawl to 88%
      var t = Math.min(elapsed / PL_LOAD_DURATION, 1);
      var eased = 1 - (1 - t) * (1 - t);
      pl.current = eased * 88;
      setProgress(pl.current);
      if (t >= 1) {
        pl.phase = "pausing";
        pl.pauseStart = now;
      }

    } else if (pl.phase === "pausing") {
      // Hold at 88%, wait for page ready AND minimum pause
      if (pl.pageReady && (now - pl.pauseStart) >= PL_MIN_PAUSE) {
        pl.phase = "finishing";
        pl.startFrom = pl.current;
        pl.startTime = now;
      }

    } else if (pl.phase === "finishing") {
      // Quick ease to 100
      var t = Math.min(elapsed / PL_FINISH_DURATION, 1);
      var eased = 1 - (1 - t) * (1 - t);
      pl.current = pl.startFrom + (100 - pl.startFrom) * eased;
      setProgress(pl.current);
      if (t >= 1) {
        pl.phase = "done";
        triggerReveal();
        return;
      }
    }

    pl.rafId = requestAnimationFrame(plTick);
  }

  // Called when page is ready
  function onPageReady() {
    pl.pageReady = true;
  }

  // Start the single loop
  pl.rafId = requestAnimationFrame(plTick);

  // Real load event
  window.addEventListener("load", onPageReady);

  // Safety: if load takes too long, force ready flag
  setTimeout(onPageReady, 5000);

  // Extreme safety: never trap users
  setTimeout(function () {
    if (pl.phase !== "done") {
      if (pl.rafId) cancelAnimationFrame(pl.rafId);
      triggerReveal();
    }
  }, 8000);

  // Curtain reveal
  function triggerReveal() {
    if (typeof gsap === "undefined") {
      if (preloader) preloader.style.display = "none";
      document.body.style.overflow = "";
      initAnimations();
      return;
    }

    var panelL = document.querySelector(".pl-panel-l");
    var panelR = document.querySelector(".pl-panel-r");
    var center = document.querySelector(".pl-center");

    if (center) {
      gsap.to(center, {
        opacity: 0,
        scale: 0.85,
        duration: 0.45,
        ease: "power2.in",
      });
    }

    var tl = gsap.timeline();
    tl.to(panelL, { x: "-100%", duration: 1, ease: "power4.inOut" }, 0.2);
    tl.to(panelR, { x: "100%", duration: 1, ease: "power4.inOut" }, 0.2);
    tl.set(preloader, {
      display: "none",
      onComplete: function () {
        document.body.style.overflow = "";
        initAnimations();
      },
    });
  }

  /* ────────────────────────────────────────────
     CURSOR FOLLOWER (desktop only)
  ──────────────────────────────────────────── */
  var cursorDot = document.getElementById("cursorDot");
  var cursorRing = document.getElementById("cursorRing");
  var cursorX = 0,
    cursorY = 0,
    ringX = 0,
    ringY = 0;
  var isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursorDot && cursorRing) {
    document.addEventListener("mousemove", function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = cursorX + "px";
      cursorDot.style.top = cursorY + "px";
    });

    function animateCursor() {
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var hoverTargets = document.querySelectorAll(
      "a, button, .pod-card, .fan-card, .menu-card, .team-card, .value-card"
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursorRing.classList.add("hovering");
      });
      el.addEventListener("mouseleave", function () {
        cursorRing.classList.remove("hovering");
      });
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = "none";
    cursorRing.style.display = "none";
  }

  /* ────────────────────────────────────────────
     NAVBAR
  ──────────────────────────────────────────── */
  var navbar = document.getElementById("navbar");

  window.addEventListener(
    "scroll",
    function () {
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
      }
    },
    { passive: true }
  );

  /* ────────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────────── */
  var menuToggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileClose = document.getElementById("mobileClose");
  var backdrop = document.querySelector(".mobile-menu-backdrop");

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

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
    });
  }
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);

  document.querySelectorAll(".mobile-link").forEach(function (l) {
    l.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ────────────────────────────────────────────
     BACK TO TOP
  ──────────────────────────────────────────── */
  var backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener(
      "scroll",
      function () {
        backBtn.classList.toggle("visible", window.scrollY > 450);
      },
      { passive: true }
    );
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ──────────────────────────────────────────── */
  var toastContainer = document.getElementById("toastContainer");
  function showToast(message, duration) {
    if (!toastContainer) return;
    duration = duration || 3000;
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("toast-out");
      toast.addEventListener("animationend", function () {
        toast.remove();
      });
    }, duration);
  }

  /* ────────────────────────────────────────────
     WHATSAPP
  ──────────────────────────────────────────── */
  var WA_NUMBER = "254700000000";
  function openWA(msg) {
    window.open(
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg),
      "_blank"
    );
  }

  var waFloat = document.getElementById("waFloat");
  if (waFloat) {
    waFloat.addEventListener("click", function (e) {
      e.preventDefault();
      openWA("Hello Coffee & Plant! I'd love to know more about your menu.");
    });
  }

  var directWaBtn = document.getElementById("directWaBtn");
  if (directWaBtn) {
    directWaBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openWA("Hello Coffee & Plant! I'd like to get in touch.");
    });
  }

  // Contact form → WhatsApp
  var waForm = document.getElementById("whatsappForm");
  if (waForm) {
    waForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("waName")
        ? document.getElementById("waName").value.trim()
        : "";
      var phone = document.getElementById("waPhone")
        ? document.getElementById("waPhone").value.trim()
        : "";
      var subject = document.getElementById("waSubject")
        ? document.getElementById("waSubject").value
        : "";
      var message = document.getElementById("waMessage")
        ? document.getElementById("waMessage").value.trim()
        : "";
      var feedback = document.getElementById("waFeedback");

      if (!name || !message) {
        feedback.textContent = "Please fill in your name and message.";
        feedback.className = "form-feedback error";
        return;
      }

      var txt = "Hello Coffee & Plant! \uD83D\uDC4B\n\nName: " + name + "\n";
      if (phone) txt += "Phone: " + phone + "\n";
      txt += "Subject: " + subject + "\n\n" + message;

      feedback.textContent = "Opening WhatsApp...";
      feedback.className = "form-feedback success";

      setTimeout(function () {
        openWA(txt);
        waForm.reset();
        feedback.textContent = "";
      }, 600);
    });
  }

  /* ────────────────────────────────────────────
     NEWSLETTER
  ──────────────────────────────────────────── */
  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      var origText = btn.textContent;
      btn.textContent = "\u2713 Thanks!";
      btn.style.background = "#4a7c5f";
      btn.disabled = true;
      showToast("You're on the list! Welcome aboard.");
      setTimeout(function () {
        btn.textContent = origText;
        btn.style.background = "";
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  /* ────────────────────────────────────────────
     HORIZONTAL DRAG SCROLL (fan favourites)
  ──────────────────────────────────────────── */
  var fanScroll = document.getElementById("fanScroll");
  if (fanScroll) {
    var isDragging = false,
      startX = 0,
      scrollLeft = 0,
      hasMoved = false;

    fanScroll.addEventListener("mousedown", function (e) {
      isDragging = true;
      hasMoved = false;
      fanScroll.classList.add("dragging");
      startX = e.pageX - fanScroll.offsetLeft;
      scrollLeft = fanScroll.scrollLeft;
    });
    fanScroll.addEventListener("mouseleave", function () {
      isDragging = false;
      fanScroll.classList.remove("dragging");
    });
    fanScroll.addEventListener("mouseup", function () {
      if (hasMoved) {
        fanScroll.classList.add("just-dragged");
        setTimeout(function () {
          fanScroll.classList.remove("just-dragged");
        }, 50);
      }
      isDragging = false;
      fanScroll.classList.remove("dragging");
    });
    fanScroll.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - fanScroll.offsetLeft;
      var delta = x - startX;
      if (Math.abs(delta) > 5) hasMoved = true;
      fanScroll.scrollLeft = scrollLeft - delta * 1.5;
    });
    fanScroll.addEventListener("click", function (e) {
      if (fanScroll.classList.contains("just-dragged")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  /* ────────────────────────────────────────────
     MENU DATA & RENDERING (services.html)
  ──────────────────────────────────────────── */
  var menuGrid = document.getElementById("menuGrid");
  if (menuGrid) {
    var menuItems = [
      { name: "Plant Powered Breakfast", price: 1400, desc: "Sourdough, crispy tofu, plant cheeze, guacamole", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Mushroom & Spinach Benedict", price: 1400, desc: "Sourdough, wild mushrooms, vegan hollandaise", category: "breakfast", dietary: ["vg"] },
      { name: "Za'atar Turkish Eggs", price: 1400, desc: "Pita, poached eggs, herbed ricotta, za'atar butter", category: "breakfast", dietary: ["d", "eg"] },
      { name: "Overnight Oats", price: 1000, desc: "Coconut mylk, granola, mixed berry compote", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Chia Pudding", price: 1000, desc: "Coconut mylk, house granola, seasonal toppings", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Smoothie Bowl", price: 1050, desc: "Mixed berries, banana, granola, seed cluster", category: "breakfast", dietary: ["vg", "n"] },
      { name: "Quinoa Buddha Bowl", price: 1450, desc: "Roasted veggies, avocado, seeds, olive oil dressing", category: "bowls", dietary: ["vg", "gf"] },
      { name: "Moroccan Buddha Bowl", price: 1450, desc: "Quinoa, chickpeas, red cabbage, pickled eggplant, hummus", category: "bowls", dietary: ["vg", "gf"] },
      { name: "Asian Buddha Bowl", price: 1200, desc: "Teriyaki tofu, rice noodles, Thai papaya salad, peanuts", category: "bowls", dietary: ["vg", "n", "sy"] },
      { name: "Mediterranean Bowl", price: 1450, desc: "Chickpea patty, hummus, parsley salad, green tahini, pita", category: "bowls", dietary: ["vg"] },
      { name: "Soba Noodles & Tofu Bowl", price: 1500, desc: "Soba noodles, peanut sauce, pan-fried tofu, daikon", category: "bowls", dietary: ["vg", "sy"] },
      { name: "Mexican Bowl", price: 1450, desc: "Black beans, corn, quinoa, tortilla chips, guacamole, salsa", category: "bowls", dietary: ["vg"] },
      { name: "Bombay Sandwich", price: 1350, desc: "Sourdough, crunchy veggies, pod mozzarella, mint chutney", category: "sandwiches", dietary: ["vg", "n"] },
      { name: "Grilled Veggie Sandwich", price: 1000, desc: "Sourdough, eggplant, courgette, carrots, spicy mayo", category: "sandwiches", dietary: ["vg"] },
      { name: "Cheddar & Carrot Chutney", price: 1200, desc: "Sourdough, spinach, carrot chutney, aged cheddar", category: "sandwiches", dietary: ["d"] },
      { name: "Tofu Sando", price: 1450, desc: "Ciabatta, crispy tofu, pickles, spicy mayo, side salad", category: "sandwiches", dietary: ["vg", "sy"] },
      { name: "Oyster Mushroom Sando", price: 1450, desc: "Ciabatta, battered mushroom, coleslaw, dill mayo", category: "sandwiches", dietary: ["vg"] },
      { name: "Korean BBQ Sando", price: 1650, desc: "Ciabatta, oyster mushrooms, Korean BBQ sauce, kimchi", category: "sandwiches", dietary: ["vg"] },
      { name: "Margherita", price: 1200, desc: "San Marzano tomato, mozzarella, fresh basil, garlic confit", category: "pizza", dietary: [] },
      { name: "Wild Mushroom", price: 1600, desc: "Gremolata base, wild mushrooms, plant mozzarella", category: "pizza", dietary: [] },
      { name: "Verdura", price: 1400, desc: "Tomato, roasted mushroom, bell peppers, plant mozzarella", category: "pizza", dietary: [] },
      { name: "Pesto Genovese", price: 1600, desc: "Pesto base, red onion, cherry tomato, mozzarella", category: "pizza", dietary: ["n"] },
      { name: "Burrata & Marinated Tomatoes", price: 1700, desc: "Plant burrata, slow-marinated heirloom tomatoes", category: "pizza", dietary: ["d"] },
      { name: "Chilli Cheese", price: 1300, desc: "Pickled chillies, cherry tomatoes, plant mozzarella", category: "pizza", dietary: [] },
      { name: "Pesto Pasta", price: 1150, desc: "Penne, house-made green pesto, pine nuts", category: "pasta", dietary: ["vg", "n"] },
      { name: "Pasta Arrabbiata", price: 1000, desc: "Penne, spiced tomato ragu, chilli, herbs", category: "pasta", dietary: ["vg"] },
      { name: "Mushroom White Sauce Pasta", price: 1300, desc: "Tagliatelle, roasted mushrooms, cashew cream sauce", category: "pasta", dietary: ["d"] },
      { name: "Anti-Inflammatory Beet", price: 750, desc: "Berry, beetroot, ginger, orange, turmeric", category: "drinks", dietary: ["vg"] },
      { name: "Green Detox", price: 750, desc: "Cucumber, apple, kale, lemon, ginger", category: "drinks", dietary: ["vg"] },
      { name: "Mixed Berry Banana", price: 750, desc: "Banana, strawberry, blueberry, yoghurt, honey", category: "drinks", dietary: ["d"] },
      { name: "Fresh Orange Juice", price: 600, desc: "Cold-pressed, freshly squeezed daily", category: "drinks", dietary: ["vg"] },
      { name: "Dawa", price: 380, desc: "Fresh ginger, honey, lemon \u2014 warming & classic", category: "drinks", dietary: [] },
      { name: "Iced Mint Frappuccino", price: 650, desc: "Espresso, mint, blended over ice", category: "drinks", dietary: [] },
      { name: "Oat Mylk 500ml", price: 350, desc: "Oats, filtered water, vanilla, sea salt", category: "plantbased", dietary: ["vg"] },
      { name: "Almond Mylk 500ml", price: 550, desc: "Almonds, filtered water, dates, vanilla", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Cashew Mylk 500ml", price: 550, desc: "Cashews, filtered water, dates, vanilla", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Coconut Mylk 500ml", price: 350, desc: "Fresh coconut, filtered water", category: "plantbased", dietary: ["vg"] },
      { name: "Cashew Butter 200g", price: 725, desc: "Cultured cashew, coconut oil, olive oil, sea salt", category: "plantbased", dietary: ["vg"] },
      { name: "Plant Mozzarella 160g", price: 400, desc: "Cashew, peanuts, tapioca \u2014 melts beautifully", category: "plantbased", dietary: ["vg", "n"] },
      { name: "Soft Cheeze Original 200g", price: 550, desc: "Cultured cashew, sea salt \u2014 tangy and spreadable", category: "plantbased", dietary: ["vg"] },
      { name: "Za'atar Cheeze 200g", price: 750, desc: "Cultured cashew with house-blended za'atar", category: "plantbased", dietary: ["vg"] },
      { name: "White Truffle Cheeze 200g", price: 850, desc: "Cultured cashew, white truffle oil \u2014 deeply savoury", category: "plantbased", dietary: ["vg"] },
      { name: "Smoked Paprika Cheeze 200g", price: 850, desc: "Cultured cashew, smoked paprika crust", category: "plantbased", dietary: ["vg"] },
      { name: "Tomato Soup + Garlic Bread", price: 500, desc: "Slow-roasted tomato, sourdough garlic bread", category: "smallbites", dietary: ["vg"] },
      { name: "Mushroom Soup + Toast", price: 650, desc: "Creamy forest mushroom, sourdough toast", category: "smallbites", dietary: ["vg"] },
      { name: "Oyster Mushroom Nuggets", price: 1000, desc: "Crispy battered, house-made dill mayo", category: "smallbites", dietary: ["vg"] },
      { name: "Jalape\u00F1o Poppers", price: 1250, desc: "Filled with plant cheeze, seasoned chipotle mayo", category: "smallbites", dietary: ["vg"] },
      { name: "Hummus & Pita", price: 1000, desc: "Classic tahini hummus, warm house pita", category: "smallbites", dietary: ["vg"] },
      { name: "Harissa Fries", price: 850, desc: "Crispy fries, house harissa, herbs", category: "smallbites", dietary: ["vg"] },
      { name: "Plain Pancakes", price: 800, desc: "Fluffy stack, maple syrup, fresh fruit", category: "pancakes", dietary: ["eg"] },
      { name: "Blueberry Pancake", price: 1000, desc: "Blueberry compote, maple syrup, coconut cream", category: "pancakes", dietary: ["eg"] },
      { name: "Sweet Buckwheat Crepe", price: 850, desc: "Gluten-free, homemade orange compote", category: "pancakes", dietary: ["vg", "gf"] },
      { name: "Savoury Buckwheat Crepe", price: 1200, desc: "Gluten-free, wild mushroom, caramelised onions", category: "pancakes", dietary: ["vg", "gf"] },
      { name: "Waffles", price: 800, desc: "Blueberry compote, maple syrup, plant butter", category: "pancakes", dietary: ["eg"] },
      { name: "Potato Waffles", price: 1350, desc: "Butter beans, pickles, house chilli mayo", category: "pancakes", dietary: ["vg"] },
    ];

    var noResults = document.getElementById("noResults");

    var dietLabels = {
      vg: { label: "Vegan", icon: "\uD83C\uDF31" },
      d: { label: "Dairy", icon: "\uD83E\uDD5B" },
      n: { label: "Nuts", icon: "\uD83E\uDD5C" },
      gf: { label: "GF", icon: "\uD83C\uDF3E" },
      sy: { label: "Soy", icon: "\uD83E\uDED8" },
      eg: { label: "Egg", icon: "\uD83E\uDD5A" },
    };

    function renderMenu(filter) {
      filter = filter || "all";
      var items =
        filter === "all"
          ? menuItems
          : menuItems.filter(function (i) {
              return i.category === filter;
            });

      if (items.length === 0) {
        menuGrid.innerHTML = "";
        noResults.style.display = "block";
        return;
      }
      noResults.style.display = "none";

      menuGrid.innerHTML = items
        .map(function (item) {
          var badges = item.dietary
            .map(function (d) {
              var dl = dietLabels[d] || { label: d, icon: "" };
              return (
                '<span class="diet-badge">' + dl.icon + " " + dl.label + "</span>"
              );
            })
            .join("");

          return (
            '<div class="menu-card">' +
            '<div class="menu-card-top">' +
            '<h3 class="item-name">' + item.name + "</h3>" +
            '<span class="item-price">Ksh ' + item.price.toLocaleString() + "</span>" +
            "</div>" +
            '<p class="item-desc">' + item.desc + "</p>" +
            '<div class="dietary">' + badges + "</div>" +
            "</div>"
          );
        })
        .join("");

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          ".menu-card",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.025,
            duration: 0.45,
            ease: "power2.out",
          }
        );
      }
    }

    renderMenu("all");

    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        renderMenu(btn.dataset.filter);
      });
    });

    var filterReset = document.getElementById("filterReset");
    if (filterReset) {
      filterReset.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        var allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add("active");
        renderMenu("all");
      });
    }
  }

  /* ────────────────────────────────────────────
     GSAP ANIMATIONS
  ──────────────────────────────────────────── */
  function initAnimations() {
    if (typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    var hasST = typeof ScrollTrigger !== "undefined";

    // Hero Home entrance
    var heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      gsap.fromTo(".hero-eyebrow",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(".hero-title",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, delay: 0.15, ease: "power4.out" }
      );
      gsap.fromTo(".hero-desc",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, delay: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(".hero-actions .btn",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, delay: 0.5, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 1.2 }
      );
    }

    // Hero parallax
    var heroBg = document.getElementById("heroImg");
    if (heroBg && hasST) {
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
    var pageHeroContent = document.querySelector(".page-hero-content");
    if (pageHeroContent) {
      gsap.from(".page-hero-content > *", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power2.out",
      });
    }

    if (!hasST) return;

    // Generic [data-anim]
    gsap.utils.toArray("[data-anim]").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: i % 3 === 0 ? 0 : (i % 3) * 0.08,
        ease: "power2.out",
      });
    });

    // Feature items
    gsap.utils.toArray(".feature-item").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: ".features-strip", start: "top 85%", once: true },
        y: 30,
        opacity: 0,
        delay: i * 0.12,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    // Pods
    gsap.utils.toArray(".pod-card").forEach(function (el, i) {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                delay: i * 0.1,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
        );
    });

    // Fan cards
    var fanScrollEl = document.getElementById("fanScroll");
    if (fanScrollEl) {
      gsap.from("#fanTrack", {
        scrollTrigger: { trigger: fanScrollEl, start: "top 85%", once: true },
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }

    // Value / Team cards
    gsap.utils.toArray(".value-card, .team-card").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        y: 40,
        opacity: 0,
        delay: (i % 3) * 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    // Stat counters
    gsap.utils.toArray(".stat-num, .story-stat-num").forEach(function (el) {
      var raw = el.textContent.replace(/[^0-9.]/g, "");
      var target = parseFloat(raw);
      if (!isNaN(target) && target > 0) {
        var suffix = el.textContent.replace(/[0-9.]/g, "");
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          textContent: 0,
          duration: 1.4,
          ease: "power1.out",
          snap: { textContent: target >= 100 ? 1 : 0.1 },
          onUpdate: function () {
            var val = parseFloat(this.targets()[0].textContent);
            el.textContent =
              (target >= 100 ? Math.round(val) : val.toFixed(0)) + suffix;
          },
        });
      }
    });

    // CTA inner
    gsap.utils.toArray(".cta-inner").forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
    });

    // Story images
    gsap.utils
      .toArray(".story-image-col img, .story-image-wrap img")
      .forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          scale: 1.08,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      });

    // Contact info items
    gsap.utils.toArray(".info-item").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        x: -20,
        opacity: 0,
        delay: i * 0.08,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    // Contact form
    var formWrap = document.querySelector(".contact-form-wrap");
    if (formWrap) {
      gsap.from(formWrap, {
        scrollTrigger: { trigger: formWrap, start: "top 85%", once: true },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
    }
  }
})();