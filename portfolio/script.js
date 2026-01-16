document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button");
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      // Send form data to your backend
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Message sent successfully!");
        form.reset();
      } else {
        console.error("EmailJS backend error:", data);
        alert("❌ Failed to send message. Check logs.");
      }
    } catch (err) {
      console.error("Network or backend error:", err);
      alert("❌ Failed to send message. Check console for details.");
    } finally {
      btn.textContent = "Send Message";
      btn.disabled = false;
    }
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

  // Trigger animation on page load
  window.dispatchEvent(new Event("scroll"));
});
