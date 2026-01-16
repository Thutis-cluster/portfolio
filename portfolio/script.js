document.addEventListener("DOMContentLoaded", async () => {
  // Fetch IDs from your Render backend
  const response = await fetch("/emailjs-config");
  const { serviceId, templateId, publicKey } = await response.json();

  emailjs.init(publicKey);

  const form = document.getElementById("contact-form");
  if (form) {
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
          alert("❌ Failed to send message. Check console for details.");
        })
        .finally(() => {
          btn.textContent = "Send Message";
          btn.disabled = false;
        });
    });
  }

  // Fade-in sections
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

  // Smooth nav scroll
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) scrollTopBtn.classList.add("show");
    else scrollTopBtn.classList.remove("show");
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
