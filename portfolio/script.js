// EMAILJS SETUP
document.addEventListener("DOMContentLoaded", () => {

  emailjs.init("a3wBtn2bKfskDS4Sa"); // Public key ONLY

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const btn = form.querySelector("button");
    btn.textContent = "Sending...";
    btn.disabled = true;

    emailjs.sendForm(
      "SERVICE_ID",
      "TEMPLATE_ID",
      form
    ).then(() => {
      alert("✅ Message sent successfully!");
      form.reset();
    }).catch(() => {
      alert("❌ Failed to send message.");
    }).finally(() => {
      btn.textContent = "Send Message";
      btn.disabled = false;
    });
  });

});

// SCROLL ANIMATION
const sections = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  sections.forEach(section => {
    const pos = section.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
});
