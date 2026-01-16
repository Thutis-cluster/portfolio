document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // EMAILJS CONTACT FORM
  // ==========================
  emailjs.init("a3wBtn2bKfskDS4Sa"); // Public key only

  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const btn = form.querySelector("button");

      // Optional phone validation
      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput && phoneInput.value) {
        const phonePattern = /^[+0-9\s\-]*$/;
        if (!phonePattern.test(phoneInput.value)) {
          alert("❌ Please enter a valid phone number.");
          phoneInput.focus();
          return; // stop submission
        }
      }

      btn.textContent = "Sending...";
      btn.disabled = true;

      const SERVICE_ID = "service_9a3fush";
      const TEMPLATE_ID = "template_3lwzm3g";

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(() => { alert("✅ Message sent successfully!"); form.reset(); })
        .catch(err => { console.error(err); alert("❌ Failed to send message."); })
        .finally(() => { btn.textContent = "Send Message"; btn.disabled = false; });
    });
  }

  // ==========================
  // SCROLL FADE-IN + STAGGERED CHILD ANIMATION
  // ==========================
  const sections = document.querySelectorAll(".fade-in");

  const revealOnScroll = () => {
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        if (section.children.length > 1) {
          section.classList.add("show", "staggered");
        } else {
          section.classList.add("show");
        }
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // trigger on load

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
});
