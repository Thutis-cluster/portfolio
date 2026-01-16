document.addEventListener("DOMContentLoaded", () => {

  emailjs.init("PUBLIC_KEY_HERE"); // Public key ONLY

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
