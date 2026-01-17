document.addEventListener("DOMContentLoaded", async () => {

  /* ==========================
     EMAILJS INIT (FROM BACKEND)
  ========================== */
  try {
    const res = await fetch("/emailjs-config");
    const data = await res.json();

    emailjs.init(data.publicKey);

    window.EMAIL_CONFIG = data; // store globally
  } catch (err) {
    console.error("Failed to load EmailJS config", err);
  }

  /* ==========================
     FADE-IN ON SCROLL
  ========================== */
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
  revealOnScroll();
  
  /* ==========================
     THANK YOU POPUP
  ========================== */
  function showPopup(message, success = true) {
    const popup = document.getElementById("popup");
    if (!popup) return;

    popup.textContent = message;
    popup.style.background = success ? "#00c851" : "#ff4444";
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 4000);
  }

  /* ==========================
     CONTACT FORM
  ========================== */
  const form = document.getElementById("contact-form");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

  // Honeypot check
  if (form.company && form.company.value !== "") {
    console.warn("Spam blocked");
    return;
  }
    
    const btn = form.querySelector("button");
    btn.textContent = "Sending...";
    btn.disabled = true;

    const { serviceId, templateId } = window.EMAIL_CONFIG;

    emailjs.sendForm(serviceId, templateId, form)
      .then(() => {
      emailjs.send(
      EMAIL_CONFIG.serviceId,
      "TEMPLATE_ID_AUTOREPLY",
       {
       name: form.name.value,
      email: form.email.value
       }
    );
        
        form.reset();
        showPopup("✅ Message sent! We’ll reply within 24 hours.", true);
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

  /* ==========================
   DARK MODE TOGGLE
========================== */
const toggle = document.getElementById("theme-toggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    toggle.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
}

  /* ==========================
     PRICING CALCULATOR
  ========================== */
  const priceCards = document.querySelectorAll(".price-card");
  const siteTypeInput = document.getElementById("site-type");
  const extrasCheckboxes = document.querySelectorAll(".extra");
  const totalEl = document.getElementById("total");

  let selectedPrice = 0;

  function updateTotal() {
    let extrasTotal = 0;
    extrasCheckboxes.forEach(cb => {
      if (cb.checked) extrasTotal += parseInt(cb.value);
    });
    const total = selectedPrice + extrasTotal;
    totalEl.textContent = `R${total.toLocaleString("en-ZA")}`;
  }

  // Price card selection
  priceCards.forEach(card => {
    const btn = card.querySelector(".select-price");
    btn.addEventListener("click", () => {
      // Remove previous selection highlight
      priceCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      // Update input and numeric price
      const priceText = card.querySelector(".price").textContent;
      selectedPrice = parseInt(priceText.replace(/[^0-9]/g, ""));
      siteTypeInput.value = `${card.querySelector("h3").textContent} (${priceText})`;

      updateTotal();
    });
  });

  // Extras checkbox
  extrasCheckboxes.forEach(cb => cb.addEventListener("change", updateTotal));

  // Initialize
  siteTypeInput.value = "Select on cards";
  updateTotal();

  /* ==========================
     PDF DOWNLOAD
  ========================== */
  const { jsPDF } = window.jspdf;
  const proposalBtn = document.getElementById("download-proposal");

  if (proposalBtn) {
    proposalBtn.addEventListener("click", () => {
      if (!selectedPrice) return alert("Please select a package first!");

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Website Proposal", 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${form.name.value || "N/A"}`, 20, 40);
      doc.text(`Email: ${form.email.value || "N/A"}`, 20, 50);
      doc.text(`Phone: ${form.phone.value || "N/A"}`, 20, 60);
      doc.text(`Selected Package: ${siteTypeInput.value}`, 20, 70);

      // Add selected extras
      const selectedExtras = Array.from(extrasCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());
      doc.text(`Extras: ${selectedExtras.join(", ") || "None"}`, 20, 80);

      doc.text(`Total: ${totalEl.textContent}`, 20, 90);
      doc.text("Thank you for considering my services!", 20, 110);
      doc.save(`Proposal_${form.name.value || "Client"}.pdf`);
    });
  }

/* ==========================
   MOBILE NAV TOGGLE
========================== */
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Close menu when link is clicked
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
    });
  });
} 
});
