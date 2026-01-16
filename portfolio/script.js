document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // INITIALIZE EMAILJS
  // ==========================
  emailjs.init("a3wBtn2bKfskDS4Sa"); // Public key only

  const form = document.getElementById("contact-form");
  const popup = document.getElementById("thank-you-popup");

  // Function to show popup messages
  const showPopup = (message, success = true) => {
    if (!popup) return;
    popup.textContent = message;
    popup.style.background = success ? "#00c851" : "#ff4444"; // green or red
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000); // disappears after 3 seconds
  };

  // ==========================
  // CONTACT FORM SUBMISSION
  // ==========================
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const btn = form.querySelector("button");

      // Optional phone validation
      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput && phoneInput.value) {
        const phonePattern = /^[+0-9\s\-]*$/;
        if (!phonePattern.test(phoneInput.value)) {
          showPopup("❌ Please enter a valid phone number.", false);
          phoneInput.focus();
          return; // stop submission
        }
      }

      btn.textContent = "Sending...";
      btn.disabled = true;

      const SERVICE_ID = "service_9a3fush";
      const TEMPLATE_ID = "template_3lwzm3g";

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(() => { 
          showPopup("✅ Message sent successfully!", true);
          form.reset(); 
        })
        .catch(err => { 
          console.error("EmailJS error:", err);
          showPopup("❌ Failed to send message.", false);
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
// SCROLL FADE-IN
// ==========================
const sections = document.querySelectorAll(".fade-in");

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
  // SMOOTH NAVIGATION SCROLL
  // ==========================
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

  // ==========================
  // SCROLL TO TOP BUTTON
  // ==========================
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
