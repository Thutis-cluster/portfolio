document.addEventListener("DOMContentLoaded", () => {

  // EMAILJS INIT
  emailjs.init("a3wBtn2bKfskDS4Sa"); // Public key ONLY

  const form = document.getElementById("contact-form");

  // CONTACT FORM SUBMIT
  form.addEventListener("submit", async e => {
  e.preventDefault();

  const btn = form.querySelector("button");
  btn.textContent = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      })
    });

    if (!res.ok) throw new Error();

    alert("✅ Message sent successfully!");
    form.reset();
  } catch {
    alert("❌ Failed to send message.");
  } finally {
    btn.textContent = "Send Message";
    btn.disabled = false;
  }
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

// RUN ON PAGE LOAD
window.dispatchEvent(new Event("scroll"));
