/*
 * Add the YouTube video ID for each published Klyaksonchik project.
 * Example:
 * youtubeId: "dQw4w9WgXcQ"
 *
 * Use only the ID after "watch?v=" or after "youtu.be/".
 */
const PROJECTS = [
  {
    youtubeId: "",
    title: "Live event screens",
    details: "LED walls / Stage content",
  },
  {
    youtubeId: "",
    title: "Advertising motion",
    details: "DOOH / Digital campaign",
  },
  {
    youtubeId: "",
    title: "Concert visuals",
    details: "Show opener / Performer backdrop",
  },
];

const projectGrid = document.querySelector("[data-project-grid]");

if (projectGrid) {
  PROJECTS.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-reveal", "");

    const videoShell = document.createElement("div");
    videoShell.className = "video-shell";

    if (project.youtubeId) {
      const iframe = document.createElement("iframe");
      iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(project.youtubeId)}` +
        "?rel=0&modestbranding=1";
      iframe.title = `${project.title} — Klyaksonchik Design Studio`;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      videoShell.appendChild(iframe);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "video-placeholder";
      placeholder.setAttribute("aria-label", `${project.title} video placeholder`);

      const mark = document.createElement("img");
      mark.src = "./assets/logo-mark.png";
      mark.alt = "";
      mark.width = 160;
      mark.height = 144;

      placeholder.appendChild(mark);
      videoShell.appendChild(placeholder);
    }

    const overlay = document.createElement("div");
    overlay.className = "project-overlay";

    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = project.title;
    const details = document.createElement("p");
    details.textContent = project.details;
    copy.append(title, details);

    const badge = document.createElement("span");
    badge.className = "project-badge";
    badge.textContent = project.youtubeId
      ? `Project ${String(index + 1).padStart(2, "0")}`
      : "YouTube embed";

    overlay.append(copy, badge);
    card.append(videoShell, overlay);
    projectGrid.appendChild(card);
  });
}

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("#site-navigation");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}

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
    "Project brief:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://wa.me/38268480723?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
