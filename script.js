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

  /* 🔹 ADD THIS LINE HERE */
  document.getElementById("estimated_total").value = totalEl.textContent;

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
   RECOMMENDED EXTRAS LOGIC
========================== */
const extraLabels = document.querySelectorAll(".calculator fieldset label");

function clearRecommendations() {
  extraLabels.forEach(label => label.classList.remove("recommended"));
}

priceCards.forEach(card => {
  const btn = card.querySelector(".select-price");

  btn.addEventListener("click", () => {
    clearRecommendations();

    const title = card.querySelector("h3").textContent.toLowerCase();

    // Only recommend extras for Basic Website
    if (title.includes("basic")) {
      extraLabels[0]?.classList.add("recommended"); // Booking
      extraLabels[1]?.classList.add("recommended"); // Payment
    }
    
    // Business Website → Booking + WhatsApp
    if (title.includes("business")) {
      extraLabels[1]?.classList.add("recommended"); // Payment
    }

    // E-commerce → Payment + Admin
    if (title.includes("commerce")) {
      extraLabels[1]?.classList.add("recommended"); // Payment
      extraLabels[2]?.classList.add("recommended"); // Admin
    }
  });
});

 /* ==========================
   PDF DOWNLOAD (IMPROVED)
========================== */
proposalBtn.addEventListener("click", () => {
  if (!selectedPrice) {
    alert("Please select a package first!");
    return;
  }

  const name = form.name.value || "N/A";
  const email = form.email.value || "N/A";
  const phone = form.phone.value || "N/A";

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Website Project Proposal", 20, 20);

  doc.setFontSize(12);
  doc.text(`Client Name: ${name}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 50);
  doc.text(`Phone: ${phone}`, 20, 60);

  doc.text(`Selected Package:`, 20, 80);
  doc.text(siteTypeInput.value, 20, 90);

  const selectedExtras = Array.from(extrasCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.parentElement.textContent.trim());

  doc.text(`Extras: ${selectedExtras.join(", ") || "None"}`, 20, 105);
  doc.text(`Estimated Total: ${totalEl.textContent}`, 20, 120);

  doc.text(
    "Thank you for choosing Kamogelo Ronald Kwetsane.\nI will contact you shortly to discuss next steps.",
    20,
    145
  );

  doc.save(`Proposal_${name.replace(/\s+/g, "_")}.pdf`);
});


/* ==========================
   SKILL MODAL LOGIC
========================== */
const skillInfo = {
  html: {
    title: "HTML",
    description:
      "HTML is the foundation of every website. It structures content such as text, images, forms, and buttons so browsers can display them correctly."
  },
  css: {
    title: "CSS",
    description:
      "CSS controls the design and layout of a website, including colors, spacing, responsiveness, and animations to create a professional look."
  },
  js: {
    title: "JavaScript",
    description:
      "JavaScript adds interactivity and logic to websites, enabling features like calculators, forms, animations, and dynamic content."
  },
  firebase: {
    title: "Firebase",
    description:
      "Firebase provides real-time databases, authentication, and hosting, allowing fast and scalable web and mobile applications."
  },
  mongodb: {
    title: "MongoDB",
    description:
      "MongoDB is a NoSQL database used to store and manage large amounts of application data efficiently."
  },
  mongoose: {
    title: "Mongoose",
    description:
      "Mongoose helps structure and manage MongoDB data by enforcing schemas and simplifying database interactions."
  },
  paystack: {
    title: "Paystack",
    description:
      "Paystack enables secure online payments, allowing businesses to accept cards, bank transfers, and mobile payments."
  },
  twilio: {
    title: "Twilio",
    description:
      "Twilio powers SMS and WhatsApp notifications, enabling automated reminders and customer communication."
  },
  render: {
    title: "Render",
    description:
      "Render is a cloud platform used to deploy and host web applications securely with automatic scaling."
  }
};

const modal = document.getElementById("skill-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalClose = modal?.querySelector(".modal-close"); // optional chaining in case missing

if (modal && modalTitle && modalDesc && modalClose) {
  document.querySelectorAll(".skills span").forEach(skill => {
    skill.addEventListener("click", () => {
      const key = skill.dataset.skill;
      if (!key || !skillInfo[key]) return; // safety check
      modalTitle.textContent = skillInfo[key].title;
      modalDesc.textContent = skillInfo[key].description;
      modal.classList.add("show");
    });
  });

  modalClose.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("show");
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
