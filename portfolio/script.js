document.addEventListener("DOMContentLoaded", async () => {

  // ==========================
  // FADE-IN SECTIONS
  // ==========================
  const sections = document.querySelectorAll(".fade-in");
  const revealOnScroll = () => {
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight - 100) {
        section.classList.add("show");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // ==========================
  // SMOOTH NAV SCROLL
  // ==========================
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ==========================
  // SCROLL TO TOP BUTTON
  // ==========================
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) scrollTopBtn.classList.add("show");
      else scrollTopBtn.classList.remove("show");
    });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================
  // EMAILJS FORM
  // ==========================
  const form = document.getElementById("contact-form");
  if (form) {
    try {
      // Fetch IDs from your backend (Render)
      const res = await fetch("/emailjs-config");
      const { serviceId, templateId, publicKey } = await res.json();

      emailjs.init(publicKey);

      form.addEventListener("submit", e => {
        e.preventDefault();
        const btn = form.querySelector("button");
        btn.textContent = "Sending...";
        btn.disabled = true;

        emailjs.sendForm(serviceId, templateId, form)
          .then(() => {
            alert("✅ Message sent successfully!");
            form.reset();
          })
          .catch(err => {
            console.error("EmailJS error:", err);
            alert("❌ Failed to send message. Check console.");
          })
          .finally(() => {
            btn.textContent = "Send Message";
            btn.disabled = false;
          });
      });

    } catch (err) {
      console.error("Failed to fetch EmailJS config:", err);
    }
  }
});
