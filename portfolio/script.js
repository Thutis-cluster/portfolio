// Initialize EmailJS (public key only)
emailjs.init("a3wBtn2bKfskDS4Sa");

// Fade in all sections
document.querySelectorAll(".fade-in").forEach(section => {
  section.classList.add("show");
});

// Contact form
const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const btn = form.querySelector("button");
    btn.textContent = "Sending...";
    btn.disabled = true;

    // Replace with your EmailJS IDs
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

