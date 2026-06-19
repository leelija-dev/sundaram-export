(function initNav() {
  var sidebar = document.getElementById("se-sidebar");
  var overlay = document.getElementById("se-overlay");
  var menuBtn = document.getElementById("se-menu-btn");
  var closeBtn = document.getElementById("se-sidebar-close");

  if (!sidebar || !overlay || !menuBtn) return;

  function setExpanded(isOpen) {
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  function openNav() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setExpanded(true);
  }

  function closeNav() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    setExpanded(false);
  }

  function toggleNav() {
    if (sidebar.classList.contains("is-open")) closeNav();
    else openNav();
  }

  menuBtn.addEventListener("click", toggleNav);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeNav);
  }

  overlay.addEventListener("click", closeNav);

  sidebar.querySelectorAll(".se-nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 1023px)").matches) closeNav();
    });
  });

  sidebar.querySelectorAll(".se-sidebar-brand a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 1023px)").matches) closeNav();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeNav();
    }
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

(function initLoadingUX() {
  var fetchingBar = document.getElementById("se-fetching-bar");
  var progressBar = document.getElementById("se-progress-bar");
  var progressFill = document.getElementById("se-progress-bar-fill");
  var fetchingCount = 0;
  var hideTimer = null;

  function setFetchingActive(active) {
    if (!fetchingBar) return;
    if (active) {
      fetchingBar.classList.add("is-active");
      fetchingBar.setAttribute("aria-hidden", "false");
    } else {
      fetchingBar.classList.remove("is-active");
      fetchingBar.setAttribute("aria-hidden", "true");
    }
    document.documentElement.classList.toggle("se-fetching-active", active);
  }

  function showFetching() {
    fetchingCount += 1;
    clearTimeout(hideTimer);
    setFetchingActive(true);
  }

  function hideFetching() {
    fetchingCount = Math.max(0, fetchingCount - 1);
    if (fetchingCount === 0) {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        setFetchingActive(false);
      }, 120);
    }
  }

  function showProgress(percent) {
    if (!progressBar || !progressFill) return;
    progressBar.hidden = false;
    progressBar.setAttribute("aria-hidden", "false");
    if (typeof percent === "number" && isFinite(percent)) {
      progressBar.classList.remove("is-indeterminate");
      progressFill.style.width = Math.min(100, Math.max(0, percent)) + "%";
      progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));
    } else {
      progressBar.classList.add("is-indeterminate");
      progressFill.style.width = "";
      progressBar.removeAttribute("aria-valuenow");
    }
  }

  function hideProgress() {
    if (!progressBar || !progressFill) return;
    progressBar.hidden = true;
    progressBar.setAttribute("aria-hidden", "true");
    progressBar.classList.remove("is-indeterminate");
    progressFill.style.width = "0";
    progressBar.removeAttribute("aria-valuenow");
  }

  function setButtonLoading(button, loading, label) {
    if (!button || button.dataset.seLoadingBound === "1" && loading) return;
    if (loading) {
      if (!button.dataset.seOriginalHtml) {
        button.dataset.seOriginalHtml = button.innerHTML;
        button.dataset.seOriginalDisabled = button.disabled ? "1" : "0";
      }
      button.disabled = true;
      button.classList.add("is-loading");
      button.setAttribute("aria-busy", "true");
      button.innerHTML =
        '<span class="se-btn-spinner" aria-hidden="true"></span><span>' +
        (label || button.dataset.loadingLabel || "Please wait…") +
        "</span>";
      button.dataset.seLoadingBound = "1";
      return;
    }
    if (button.dataset.seOriginalHtml) {
      button.innerHTML = button.dataset.seOriginalHtml;
      button.disabled = button.dataset.seOriginalDisabled === "1";
      delete button.dataset.seOriginalHtml;
      delete button.dataset.seOriginalDisabled;
    }
    button.classList.remove("is-loading");
    button.removeAttribute("aria-busy");
    delete button.dataset.seLoadingBound;
  }

  function shouldTrackLink(link, event) {
    if (!link || link.dataset.noFetching !== undefined || link.dataset.noLoader !== undefined) {
      return false;
    }
    if (event && (event.defaultPrevented || event.button !== 0)) return false;
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false;
    if (link.target && link.target !== "_self") return false;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

    try {
      var url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  function isDownloadLink(link) {
    if (!link) return false;
    if (link.hasAttribute("download")) return true;
    try {
      var url = new URL(link.href, window.location.href);
      return /\/print\/?$/.test(url.pathname);
    } catch (e) {
      return false;
    }
  }

  function formHasSelectedFile(form) {
    var inputs = form.querySelectorAll('input[type="file"]');
    for (var i = 0; i < inputs.length; i += 1) {
      if (inputs[i].files && inputs[i].files.length > 0) return true;
    }
    return false;
  }

  function submitWithUploadProgress(form, submitter) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData(form);
    var method = (form.getAttribute("method") || "post").toUpperCase();
    var action = form.getAttribute("action") || window.location.href;

    showProgress(null);
    setButtonLoading(
      submitter || form.querySelector('[type="submit"]'),
      true,
      submitter && submitter.dataset.loadingLabel
    );

    xhr.open(method, action);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        showProgress((event.loaded / event.total) * 100);
      } else {
        showProgress(null);
      }
    });

    xhr.addEventListener("load", function () {
      hideProgress();
      if (xhr.status >= 200 && xhr.status < 400) {
        if (xhr.responseURL && xhr.responseURL !== window.location.href) {
          window.location.href = xhr.responseURL;
          return;
        }
        window.location.reload();
        return;
      }
      setButtonLoading(submitter || form.querySelector('[type="submit"]'), false);
      if (typeof window.seDeskToast === "function") {
        window.seDeskToast("Upload failed. Please try again.", "error");
      }
    });

    xhr.addEventListener("error", function () {
      hideProgress();
      setButtonLoading(submitter || form.querySelector('[type="submit"]'), false);
      if (typeof window.seDeskToast === "function") {
        window.seDeskToast("Upload failed. Please try again.", "error");
      }
    });

    xhr.send(formData);
  }

  window.addEventListener("load", hideFetching);
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) hideFetching();
    hideProgress();
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!shouldTrackLink(link, event)) return;
    if (isDownloadLink(link)) {
      showProgress(null);
    } else {
      showFetching();
    }
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || form.tagName !== "FORM") return;
    if (form.dataset.noLoader !== undefined) return;

    var method = (form.getAttribute("method") || "get").toLowerCase();
    if (method === "get" && !form.dataset.loaderOnGet) return;

    var submitter = event.submitter || null;
    var loadingLabel =
      (submitter && submitter.dataset.loadingLabel) ||
      form.dataset.loadingLabel ||
      (submitter && submitter.classList.contains("se-btn-danger") ? "Deleting…" : "Saving…");

    if (form.enctype === "multipart/form-data" && formHasSelectedFile(form)) {
      event.preventDefault();
      submitWithUploadProgress(form, submitter);
      return;
    }

    setButtonLoading(submitter || form.querySelector('[type="submit"]'), true, loadingLabel);
  });

  window.seDeskFetching = { show: showFetching, hide: hideFetching };
  window.seDeskProgress = { show: showProgress, hide: hideProgress };
  window.seDeskLoader = { show: showFetching, hide: hideFetching };
})();
