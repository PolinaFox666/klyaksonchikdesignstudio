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
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.08,
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
