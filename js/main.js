(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeColor = document.querySelector("[data-theme-color]");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const readSavedTheme = () => {
    try {
      const saved = localStorage.getItem("theme");
      return saved === "light" || saved === "dark" ? saved : null;
    } catch {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    themeButton?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    themeColor?.setAttribute("content", theme === "dark" ? "#101713" : "#f4efe5");

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch {
        // The visual preference still applies when storage is unavailable.
      }
    }
  };

  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

  themeButton?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  const handleSystemThemeChange = (event) => {
    if (!readSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", handleSystemThemeChange);
  } else {
    systemTheme.addListener(handleSystemThemeChange);
  }

  const header = document.querySelector("[data-header]");
  const navigation = document.querySelector("#primary-navigation");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sectionLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
  const desktopQuery = window.matchMedia("(min-width: 56.25rem)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const closeMenu = (restoreFocus = false) => {
    if (!navigation || !toggle) return;

    navigation.classList.remove("is-open");
    header?.classList.remove("is-menu-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");

    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    if (!navigation || !toggle) return;

    navigation.classList.add("is-open");
    header?.classList.add("is-menu-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  };

  toggle?.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      toggle?.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Node &&
      !navigation?.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  navLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));

  const handleDesktopChange = (event) => {
    if (event.matches) closeMenu();
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else {
    desktopQuery.addListener(handleDesktopChange);
  }

  const setActiveSection = (sectionId) => {
    sectionLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-30% 0px -58%", threshold: [0, 0.12, 0.35] }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const revealItems = [...document.querySelectorAll(".reveal")];

  const showAll = () => revealItems.forEach((item) => item.classList.add("is-visible"));

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7%", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const handleMotionChange = (event) => {
    if (event.matches) showAll();
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
