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

  /* =================================
  PDF INTERGATION
========================================== */
  const { jsPDF } = window.jspdf;
const proposalBtn = document.getElementById("download-proposal");

if (proposalBtn) {
  proposalBtn.addEventListener("click", () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Website Proposal", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${form.name.value}`, 20, 40);
    doc.text(`Email: ${form.email.value}`, 20, 50);
    doc.text(`Phone: ${form.phone ? form.phone.value : "N/A"}`, 20, 60);
    doc.text(`Website Type: ${siteType.options[siteType.selectedIndex].text}`, 20, 70);
    doc.text(`Extras: ${extras.options[extras.selectedIndex].text}`, 20, 80);
    doc.text(`Estimated Budget: ${totalEl.textContent}`, 20, 90);
    doc.text("Thank you for considering our services!", 20, 110);

    doc.save(`Proposal_${form.name.value}.pdf`);
  });
}

  /* ==========================
   PRICING CALCULATOR (ZAR)
========================== */
const siteType = document.getElementById("site-type");
const extras = document.getElementById("extras");
const totalEl = document.getElementById("total");

function updateTotal() {
  if (!siteType || !extras || !totalEl) return;

  const total =
    parseInt(siteType.value) + parseInt(extras.value);

  totalEl.textContent = `R${total.toLocaleString("en-ZA")}`;
}

if (siteType && extras) {
  siteType.addEventListener("change", updateTotal);
  extras.addEventListener("change", updateTotal);
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

// Pricing selection
let selectedPrice = null;
const priceButtons = document.querySelectorAll(".select-price");
const totalEl = document.createElement("p");
totalEl.style.marginTop = "15px";

priceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Reset previous selection
    priceButtons.forEach(b => b.style.background = "#00c6ff");
    btn.style.background = "#243b55";
    selectedPrice = btn.parentElement.querySelector(".price").textContent;
    btn.parentElement.appendChild(totalEl);
    totalEl.textContent = `Selected Price: ${selectedPrice}`;
  });
});
