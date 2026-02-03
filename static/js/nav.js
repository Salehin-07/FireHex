// ============================================
// ENHANCED NAVBAR FUNCTIONALITY
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("mainNav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  // Toggle mobile menu
  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.querySelector("i").classList.toggle("fa-bars");
    toggle.querySelector("i").classList.toggle("fa-xmark");
    document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
  });

  // Close when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("open");
      toggle.querySelector("i").classList.add("fa-bars");
      toggle.querySelector("i").classList.remove("fa-xmark");
      document.body.style.overflow = "";
    }
  });

  // Animate dropdowns for mobile
  dropdownToggles.forEach((toggleEl) => {
    toggleEl.addEventListener("click", (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        const dropdownMenu = toggleEl.nextElementSibling;
        dropdownMenu.classList.toggle("open");
        dropdownMenu.style.maxHeight = dropdownMenu.classList.contains("open")
          ? dropdownMenu.scrollHeight + "px"
          : "0";
      }
    });
  });

  // Scroll behavior
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
});