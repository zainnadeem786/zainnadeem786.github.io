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

  const inquiryForm = document.querySelector("[data-project-inquiry]");
  const inquirySuccessDialog = document.querySelector("[data-inquiry-success-dialog]");

  if (inquiryForm instanceof HTMLFormElement) {
    const submitButton = inquiryForm.querySelector("button[type='submit']");
    const submitLabel = inquiryForm.querySelector("[data-submit-label]");
    const formStatus = inquiryForm.querySelector("[data-form-status]");
    const dialogCloseButtons = inquirySuccessDialog?.querySelectorAll("[data-success-dialog-close]") ?? [];
    const dialogDoneButton = inquirySuccessDialog?.querySelector(".success-dialog-done");
    let isSubmitting = false;
    let dialogReturnFocus = null;

    const closeSuccessDialog = () => {
      if (inquirySuccessDialog instanceof HTMLDialogElement && inquirySuccessDialog.open) {
        inquirySuccessDialog.close();
      }
    };

    const openSuccessDialog = () => {
      if (!(inquirySuccessDialog instanceof HTMLDialogElement) || inquirySuccessDialog.open) return;

      dialogReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : submitButton;
      document.body.classList.add("success-dialog-open");
      inquirySuccessDialog.showModal();
      requestAnimationFrame(() => {
        if (dialogDoneButton instanceof HTMLButtonElement) dialogDoneButton.focus({ preventScroll: true });
      });
    };

    dialogCloseButtons.forEach((button) => button.addEventListener("click", closeSuccessDialog));

    inquirySuccessDialog?.addEventListener("click", (event) => {
      if (event.target === inquirySuccessDialog) closeSuccessDialog();
    });

    inquirySuccessDialog?.addEventListener("close", () => {
      document.body.classList.remove("success-dialog-open");
      const focusTarget = dialogReturnFocus?.isConnected ? dialogReturnFocus : submitButton;
      dialogReturnFocus = null;
      if (focusTarget instanceof HTMLElement) focusTarget.focus({ preventScroll: true });
    });

    inquiryForm.addEventListener("input", () => {
      if (isSubmitting || !formStatus) return;
      formStatus.textContent = "";
      formStatus.removeAttribute("data-state");
    });

    inquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting || !inquiryForm.reportValidity()) return;

      isSubmitting = true;
      inquiryForm.setAttribute("aria-busy", "true");
      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending…";
      if (formStatus) {
        formStatus.textContent = "Submitting your project inquiry…";
        formStatus.removeAttribute("data-state");
      }

      try {
        const response = await fetch(inquiryForm.action, {
          method: "POST",
          body: new FormData(inquiryForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");

        inquiryForm.reset();
        if (formStatus) {
          formStatus.textContent = "";
          formStatus.removeAttribute("data-state");
        }
        openSuccessDialog();
      } catch {
        if (formStatus) {
          formStatus.textContent = "Something went wrong and your inquiry could not be submitted. Please try again, or contact me directly by email.";
          formStatus.setAttribute("data-state", "error");
        }
      } finally {
        isSubmitting = false;
        inquiryForm.removeAttribute("aria-busy");
        if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = "Send inquiry";
      }
    });
  }

  const faqItems = [...document.querySelectorAll("details.faq-item")];

  faqItems.forEach((details) => {
    const summary = details.querySelector(".faq-summary");
    const answer = details.querySelector(".faq-answer");
    if (!summary || !answer) return;

    const closeDetails = (targetDetails, animate = true) => {
      const targetAnswer = targetDetails.querySelector(".faq-answer");
      if (!targetDetails.open || !targetAnswer) return;

      if (!animate || reducedMotionQuery.matches || typeof targetAnswer.animate !== "function") {
        targetDetails.open = false;
        targetDetails.classList.remove("is-closing", "is-opening");
        return;
      }

      targetDetails.classList.remove("is-opening");
      targetDetails.classList.add("is-closing");
      const startHeight = targetAnswer.offsetHeight;

      const animation = targetAnswer.animate(
        [
          { height: `${startHeight}px`, opacity: 1 },
          { height: "0px", opacity: 0 }
        ],
        {
          duration: 250,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
        }
      );

      animation.onfinish = () => {
        targetDetails.open = false;
        targetDetails.classList.remove("is-closing");
      };

      animation.oncancel = () => {
        targetDetails.classList.remove("is-closing");
      };
    };

    const openDetails = (targetDetails, animate = true) => {
      const targetAnswer = targetDetails.querySelector(".faq-answer");
      if (!targetAnswer) return;

      faqItems.forEach((other) => {
        if (other !== targetDetails && other.open) {
          closeDetails(other, animate);
        }
      });

      if (!animate || reducedMotionQuery.matches || typeof targetAnswer.animate !== "function") {
        targetDetails.open = true;
        targetDetails.classList.remove("is-closing", "is-opening");
        return;
      }

      targetDetails.classList.remove("is-closing");
      targetDetails.classList.add("is-opening");
      targetDetails.open = true;

      const targetHeight = targetAnswer.scrollHeight;

      const animation = targetAnswer.animate(
        [
          { height: "0px", opacity: 0 },
          { height: `${targetHeight}px`, opacity: 1 }
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)"
        }
      );

      animation.onfinish = () => {
        targetDetails.classList.remove("is-opening");
      };

      animation.oncancel = () => {
        targetDetails.classList.remove("is-opening");
      };
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.open) {
        closeDetails(details, true);
      } else {
        openDetails(details, true);
      }
    });
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
