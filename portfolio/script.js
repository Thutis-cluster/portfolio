document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // EMAILJS CONTACT FORM
  // ==========================
  emailjs.init("a3wBtn2bKfskDS4Sa"); // public key only

  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const btn = form.querySelector("button");
      btn.textContent = "Sending...";
      btn.disabled = true;

      // Debug: log form data
      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const SERVICE_ID = "service_9a3fush";
      const TEMPLATE_ID = "template_3lwzm3g";

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
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
  } else {
    console.error("Contact form not found in DOM!");
  }

  // ==========================
  // INITIAL FADE-IN ON PAGE LOAD
  // ==========================
  const sections = document.querySelectorAll(".fade-in");
  sections.forEach(section => section.classList.add("show"));

  // ==========================
  // SCROLL FADE-IN ANIMATION
  // ==========================
  const revealOnScroll = () => {
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        section.classList.add("show");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // trigger on page load

  // ==========================
  // SMOOTH NAV SCROLL
  // ==========================
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
