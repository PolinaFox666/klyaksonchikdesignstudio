const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("#site-navigation");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  if (!navigation) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -5% 0px",
      threshold: 0.06,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const motionVideos = [...document.querySelectorAll("[data-motion-video]")];

const syncVideoState = (video) => {
  const card = video.closest(".motion-card");
  const button = card?.querySelector("[data-video-toggle]");
  const label = button?.querySelector(".video-toggle-label");
  const playing = !video.paused && !video.ended;

  card?.classList.toggle("is-playing", playing);
  if (button) button.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  if (label) label.textContent = playing ? "Pause" : "Play";
};

const pauseOtherVideos = (activeVideo) => {
  motionVideos.forEach((video) => {
    if (video !== activeVideo && !video.paused) video.pause();
  });
};

motionVideos.forEach((video) => {
  const card = video.closest(".motion-card");
  const toggle = card?.querySelector("[data-video-toggle]");

  const togglePlayback = () => {
    if (video.paused) {
      pauseOtherVideos(video);
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  toggle?.addEventListener("click", togglePlayback);
  video.addEventListener("click", togglePlayback);
  video.addEventListener("play", () => {
    pauseOtherVideos(video);
    syncVideoState(video);
  });
  video.addEventListener("pause", () => syncVideoState(video));
  video.addEventListener("ended", () => syncVideoState(video));
  syncVideoState(video);
});

const featuredMotionVideo = document.querySelector("[data-motion-video][data-autoplay]");

if (featuredMotionVideo && !prefersReducedMotion && "IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        pauseOtherVideos(featuredMotionVideo);
        featuredMotionVideo.play().catch(() => {});
      } else {
        featuredMotionVideo.pause();
      }
    },
    { threshold: 0.45 },
  );

  motionObserver.observe(featuredMotionVideo);
}

const workCards = [...document.querySelectorAll(".work-card")];

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxMeta = document.querySelector("[data-lightbox-meta]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
let activeCard = null;

const getVisibleCards = () => workCards.filter((card) => !card.hidden);

const renderLightboxCard = (card) => {
  if (!card || !lightboxImage || !lightboxTitle || !lightboxMeta) return;
  activeCard = card;
  lightboxImage.src = card.dataset.lightboxSrc || "";
  lightboxImage.alt = card.querySelector("img")?.alt || "";
  lightboxTitle.textContent = card.dataset.lightboxTitle || "";
  lightboxMeta.textContent = card.dataset.lightboxMeta || "";
};

const openLightbox = (card) => {
  if (!lightbox) return;
  renderLightboxCard(card);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
  activeCard?.focus();
};

const moveLightbox = (direction) => {
  const cards = getVisibleCards();
  if (!cards.length || !activeCard) return;
  const currentIndex = Math.max(0, cards.indexOf(activeCard));
  const nextIndex = (currentIndex + direction + cards.length) % cards.length;
  renderLightboxCard(cards[nextIndex]);
};

workCards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox && !lightbox.hidden) {
      closeLightbox();
    } else {
      closeMenu();
    }
  }

  if (lightbox && !lightbox.hidden) {
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  }
});

const form = document.querySelector("#whatsapp-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const whatsappMessage = [
    "Hello Klyaksonchik Design Studio,",
    "",
    `Name: ${name}`,
    company ? `Company / event: ${company}` : "",
    `Project type: ${projectType}`,
    "",
    "Project details:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://wa.me/38268480723?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
