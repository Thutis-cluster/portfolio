document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

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
    } catch (err) {
      alert("❌ Failed to send message.");
      console.error(err);
    } finally {
      btn.textContent = "Send Message";
      btn.disabled = false;
    }
  });
});

// Scroll animation
const sections = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  sections.forEach(section => {
    const pos = section.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
});

window.dispatchEvent(new Event("scroll"));
