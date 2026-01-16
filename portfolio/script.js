document.addEventListener("DOMContentLoaded", async () => {
  // Fade-in on scroll
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
      if(target) target.scrollIntoView({ behavior:"smooth" });
    });
  });

  // Contact form
  const form = document.getElementById("contact-form");
  const popup = document.getElementById("popup");

  if(form){
    try {
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
            form.reset();
            showPopup("✅ Message sent successfully!");
          })
          .catch(err => {
            console.error("EmailJS error:", err);
            showPopup("❌ Failed to send message.");
          })
          .finally(() => {
            btn.textContent = "Send Message";
            btn.disabled = false;
          });
      });

    } catch(err){
      console.error("Failed to fetch EmailJS config:", err);
    }
  }

  function showPopup(msg){
    popup.textContent = msg;
    popup.classList.add("show");
    setTimeout(()=> popup.classList.remove("show"), 4000);
  }
});
