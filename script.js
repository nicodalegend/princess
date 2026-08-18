// =========================================================================
// NICODALEGEND — SCRIPT.JS
// =========================================================================

// ========================================
// SITE CONFIGURATION
// Edit the values below to update the site.
// Leave discordUrl / techdomUrl empty ("") to keep those cards on
// "Coming soon". As soon as you paste a real URL in, the matching
// card and footer link switch themselves on automatically — no other
// code changes needed.
// ========================================
const SITE_CONFIG = {
  username: "NicoDaLegend",

  xUrl: "https://x.com/nicodalegend",
  xLabel: "Follow me on X",

  throneUrl: "https://throne.com/nicodalegend",
  throneLabel: "Visit my Throne",

  // Paste your invite link here when it's ready, e.g. "https://discord.gg/example"
  discordUrl: "",
  discordLabel: "Join Discord",

  // Paste your Techdom Programs URL here when it's ready
  techdomUrl: "",
  techdomLabel: "View Programs",
};

// ========================================
// IMAGE CONFIGURATION
// Replace these files in /assets/ — keep the same filenames and the
// site will pick up the new images automatically. Nothing here needs
// to change unless you rename a file.
// ========================================
const IMAGES = {
  profile: "profile.jpg", // circular portrait shown in the hero — currently sitting at the repo root
  hero: "assets/hero.png", // used for the Open Graph / link-preview image
  background: "assets/background.png", // optional, currently unused (CSS handles the background)
  x: "assets/x.png", // optional icon override for the X card
  throne: "assets/throne.png", // optional icon override for the Throne card
  discord: "assets/discord.png", // optional icon override for the Discord card
  techdom: "assets/techdom.png", // optional icon override for the Techdom card
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupProfileImage();
  setupNav();
  setupSmoothScroll();
  setupReveal();
  setupParticles();
  setupTechdomPreview();
});
function applyConfig() {
  // X — always live
  setActiveLink(["heroXLink", "xCardLink"], SITE_CONFIG.xUrl);
  const footerX = document.getElementById("footerXLink");
  if (footerX && SITE_CONFIG.xUrl) footerX.href = SITE_CONFIG.xUrl;

  // Throne — always live
  setActiveLink(["throneCardLink"], SITE_CONFIG.throneUrl);
  const footerThrone = document.getElementById("footerThroneLink");
  if (footerThrone && SITE_CONFIG.throneUrl) footerThrone.href = SITE_CONFIG.throneUrl;

  // Discord — unlocks automatically once discordUrl is set
  unlockWhenReady({
    url: SITE_CONFIG.discordUrl,
    label: SITE_CONFIG.discordLabel,
    cardId: "discord-card",
    buttonId: "discordCardBtn",
    footerId: "footerDiscordLink",
  });

  // Techdom — unlocks automatically once techdomUrl is set
  unlockWhenReady({
    url: SITE_CONFIG.techdomUrl,
    label: SITE_CONFIG.techdomLabel,
    cardId: "techdom-card",
    buttonId: "techdomCardBtn",
    footerId: "footerTechdomLink",
  });
}

function setActiveLink(ids, url) {
  if (!url) return;
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

// Turns a "Coming soon" card/button/footer-link into a live one the
// moment a URL is present in SITE_CONFIG. Safe to call with an empty
// string — the card simply stays in its coming-soon state.
function unlockWhenReady({ url, label, cardId, buttonId, footerId }) {
  const card = document.getElementById(cardId);
  const button = document.getElementById(buttonId);
  const footerLink = document.getElementById(footerId);

  if (!url) return; // still coming soon — nothing to do

  if (card) card.classList.add("is-unlocked");

  if (button) {
    const link = document.createElement("a");
    link.id = button.id;
    link.className = "card__btn";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    button.replaceWith(link);
  }

  const statusEls = card ? card.querySelectorAll(".card__status--soon") : [];
  statusEls.forEach((el) => {
    el.innerHTML = '<span class="status-dot" aria-hidden="true"></span>Live';
    el.classList.remove("card__status--soon");
    el.classList.add("card__status--live");
  });

  if (footerLink) {
    const link = document.createElement("a");
    link.id = footerLink.id;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = footerLink.textContent;
    footerLink.replaceWith(link);
  }
}

// ---------- Profile image with graceful fallback ----------
function setupProfileImage() {
  const img = document.getElementById("profileImg");
  const fallback = document.getElementById("profileFallback");
  if (!img || !fallback) return;

  img.src = IMAGES.profile;

  img.addEventListener("error", () => {
    img.classList.add("is-broken");
    fallback.style.display = "flex";
    fallback.style.alignItems = "center";
    fallback.style.justifyContent = "center";
    fallback.style.width = "100%";
    fallback.style.height = "100%";
  });
}

// ---------- Sticky nav mobile toggle ----------
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("navMobile");
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

// ---------- Smooth scroll for in-page anchors ----------
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  });
}

// ---------- Scroll-triggered reveal animations ----------
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

// ---------- Ambient floating particles in the background ----------
function setupParticles() {
  const field = document.getElementById("particleField");
  if (!field) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = window.innerWidth < 640 ? 14 : 28;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${14 + Math.random() * 14}s`;
    particle.style.animationDelay = `${Math.random() * 16}s`;
    particle.style.opacity = String(0.25 + Math.random() * 0.4);
    fragment.appendChild(particle);
  }

  field.appendChild(fragment);
}

// ---------- Techdom "sneak peek" modal ----------
// The Techdom Programs card isn't live yet (no techdomUrl set), but clicking
// it opens a preview of what's coming instead of doing nothing. Once a real
// techdomUrl is added to SITE_CONFIG, unlockWhenReady() swaps the card over
// to a real link and this preview stops opening (see the is-unlocked check
// below), so nothing needs to be removed by hand later.
function setupTechdomPreview() {
  const card = document.getElementById("techdom-card");
  const trigger = document.getElementById("techdomCardBtn");
  const overlay = document.getElementById("techdomModalOverlay");
  const closeBtn = document.getElementById("techdomModalClose");
  if (!card || !overlay) return;

  let lastFocused = null;

  function openModal() {
    if (card.classList.contains("is-unlocked")) return; // real link takes over once live
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function onKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  // Clicking anywhere on the card opens the preview...
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return; // ...unless it's already a real link
    openModal();
  });

  // ...and the button works on its own too, for keyboard/screen-reader users.
  if (trigger) {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      openModal();
    });
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}
