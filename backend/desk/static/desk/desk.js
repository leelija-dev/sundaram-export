(function initNav() {
  var sidebar = document.getElementById("se-sidebar");
  var overlay = document.getElementById("se-overlay");
  var menuBtn = document.getElementById("se-menu-btn");

  if (!sidebar || !overlay || !menuBtn) return;

  function openNav() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) closeNav();
    else openNav();
  });

  overlay.addEventListener("click", closeNav);

  sidebar.querySelectorAll(".se-nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 1023px)").matches) closeNav();
    });
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 1024px)").matches) closeNav();
  });
})();

(function initUserMenu() {
  var menu = document.getElementById("se-user-menu");
  var btn = document.getElementById("se-user-menu-btn");
  var dropdown = document.getElementById("se-user-dropdown");

  if (!menu || !btn || !dropdown) return;

  function closeMenu() {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    dropdown.hidden = true;
  }

  function openMenu() {
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    dropdown.hidden = false;
  }

  function toggleMenu() {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  btn.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", closeMenu);
})();

(function initToasts() {
  var STACK_ID = "se-toast-stack";
  var DEFAULT_DURATION = 4200;

  function getStack() {
    var stack = document.getElementById(STACK_ID);
    if (!stack) {
      stack = document.createElement("div");
      stack.id = STACK_ID;
      stack.className = "se-toast-stack";
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("aria-atomic", "false");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function normalizeType(type) {
    if (!type) return "success";
    type = String(type).toLowerCase();
    if (type === "danger") return "error";
    if (type === "error" || type === "warning" || type === "info" || type === "success") return type;
    return "success";
  }

  function dismissToast(el) {
    if (!el || el.classList.contains("is-leaving")) return;
    el.classList.remove("is-visible");
    el.classList.add("is-leaving");
    clearTimeout(el._dismissTimer);
    setTimeout(function () {
      el.remove();
    }, 320);
  }

  function bindClose(el) {
    var closeBtn = el.querySelector(".se-toast-close");
    if (!closeBtn || closeBtn.dataset.seToastBound) return;
    closeBtn.dataset.seToastBound = "1";
    closeBtn.addEventListener("click", function () {
      dismissToast(el);
    });
  }

  function revealToast(el, delay) {
    bindClose(el);
    setTimeout(function () {
      requestAnimationFrame(function () {
        el.classList.add("is-visible");
      });
      el._dismissTimer = setTimeout(function () {
        dismissToast(el);
      }, DEFAULT_DURATION);
    }, delay || 0);
  }

  function showToast(message, type, duration) {
    var stack = getStack();
    var toastType = normalizeType(type);
    var el = document.createElement("div");
    el.className = "se-toast se-toast-" + toastType;
    el.setAttribute("role", "alert");
    el.setAttribute("data-se-toast", "");

    var text = document.createElement("span");
    text.className = "se-toast-text";
    text.textContent = message;

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "se-toast-close";
    closeBtn.setAttribute("aria-label", "Dismiss");
    closeBtn.innerHTML = "&times;";

    el.appendChild(text);
    el.appendChild(closeBtn);
    stack.appendChild(el);

    var ms = typeof duration === "number" ? duration : DEFAULT_DURATION;
    bindClose(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("is-visible");
      });
    });
    el._dismissTimer = setTimeout(function () {
      dismissToast(el);
    }, ms);
    return el;
  }

  function initExisting() {
    var stack = document.getElementById(STACK_ID);
    if (!stack) return;
    var toasts = stack.querySelectorAll("[data-se-toast]");
    toasts.forEach(function (el, index) {
      revealToast(el, index * 120);
    });
  }

  window.seDeskToast = showToast;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExisting);
  } else {
    initExisting();
  }
})();
