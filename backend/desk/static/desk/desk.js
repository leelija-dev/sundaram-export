(function () {
  const sidebar = document.getElementById("se-sidebar");
  const overlay = document.getElementById("se-overlay");
  const menuBtn = document.getElementById("se-menu-btn");

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
