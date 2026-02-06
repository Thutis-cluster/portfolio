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

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Honeypot check
      if (form.company && form.company.value !== "") {
        console.warn("Spam blocked");
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      btn.textContent = "Sending...";
      btn.disabled = true;

      // Store estimate in hidden field
      document.getElementById("estimated_total").value = totalEl.textContent;

      const { serviceId, templateId } = window.EMAIL_CONFIG;

      emailjs.sendForm(serviceId, templateId, form)
        .then(() => {
          // Optional auto-reply
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
  }

  /* ==========================
   DARK MODE TOGGLE
  ========================== */
  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
  }

  /* ==========================
     PRICING CALCULATOR
  ========================== */
  const priceCards = document.querySelectorAll(".price-card");
  const siteTypeInput = document.getElementById("site-type");
  const extrasCheckboxes = document.querySelectorAll(".extra");
  const totalEl = document.getElementById("total");
  const calculator = document.querySelector(".calculator");

  let selectedPrice = 0;

  function updateTotal() {
    let extrasTotal = 0;
    extrasCheckboxes.forEach(cb => {
      if (cb.checked) extrasTotal += Number(cb.value);
    });

    const total = selectedPrice + extrasTotal;
    totalEl.textContent = `R${total.toLocaleString("en-ZA")}`;
  }

  priceCards.forEach(card => {
    const btn = card.querySelector(".select-price");

    btn.addEventListener("click", () => {
      priceCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      const priceText = card.querySelector(".price").textContent;
      selectedPrice = Number(priceText.replace(/[^0-9]/g, ""));
      siteTypeInput.value = `${card.querySelector("h3").textContent} (${priceText})`;

      updateTotal();

      // 🔥 SCROLL TO ESTIMATOR
      calculator?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  extrasCheckboxes.forEach(cb => cb.addEventListener("change", updateTotal));
  updateTotal();

  /* ==========================
   RECOMMENDED EXTRAS LOGIC
  ==========================
  */
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
        extraLabels[0]?.classList.add("recommended"); // App
        extraLabels[1]?.classList.add("recommended"); // Booking
        extraLabels[2]?.classList.add("recommended"); // Payment
        extraLabels[3]?.classList.add("recommended"); // Admin Dashboard
      }
      
      // Business Website → Booking + WhatsApp
      if (title.includes("business")) {
        extraLabels[0]?.classList.add("recommended"); // App
        extraLabels[2]?.classList.add("recommended"); // Payment
        extraLabels[3]?.classList.add("recommended"); // Admin Dashboard
      }

      // E-commerce → Payment + Admin
      if (title.includes("commerce")) {
        extraLabels[0]?.classList.add("recommended"); // App
        extraLabels[1]?.classList.add("recommended"); // Booking
      }
    });
  });

  /* ==========================
     PROCEED TO CONTACT BUTTON
  ========================== */
  const proceedBtn = document.getElementById("whatsapp-btn");
  const contactSection = document.getElementById("contact");

  proceedBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!selectedPrice) {
      alert("Please select a package first!");
      return;
    }

    // Store estimate in hidden input
    document.getElementById("estimated_total").value = totalEl.textContent;

    // Scroll to contact section
    contactSection.scrollIntoView({ behavior: "smooth" });
  });

  /* ==========================
     PDF DOWNLOAD
  ========================== */
  const proposalBtn = document.getElementById("download-proposal");

proposalBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim() || "N/A";
  const message = form.message.value.trim();
  const estimate = document.getElementById("estimated_total").value.trim();
  const selectedPackage = siteTypeInput.value.trim();

  // Validate
  if (!selectedPackage || !name || !email || !message || !estimate) {
    alert("Please select a package and fill out your contact info before downloading the proposal.");
    return;
  }

  const selectedExtras = Array.from(extrasCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.parentElement.textContent.trim());

  const doc = new jsPDF();

  // ===== Header =====
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Website Project Proposal", 20, 25);

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30); // horizontal line

  let y = 40; // starting y position for content

  // ===== Client Info =====
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Client Information", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${name}`, 20, y); y += 6;
  doc.text(`Email: ${email}`, 20, y); y += 6;
  doc.text(`Phone: ${phone}`, 20, y); y += 12;

  // ===== Selected Package & Extras =====
  doc.setFont("helvetica", "bold");
  doc.text("Selected Package", 20, y); y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(selectedPackage, 20, y); y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("Selected Extras", 20, y); y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(selectedExtras.join(", ") || "None", 20, y); y += 12;

  // ===== Estimate Highlight =====
  doc.setFillColor(0, 198, 255); // bright blue
  doc.setDrawColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.rect(20, y, 80, 10, "F"); // filled rectangle
  doc.text(`Estimated Total: ${estimate}`, 25, y + 7);
  y += 20;
  doc.setTextColor(0, 0, 0); // reset text color

  // ===== Client Message =====
  doc.setFont("helvetica", "bold");
  doc.text("Client Message", 20, y); y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(message, 20, y, { maxWidth: 170 }); // wrap text
  y += 20;

  // ===== Footer =====
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing Kamogelo Ronald Kwetsane.\nI will contact you shortly to discuss next steps.",
    20,
    y,
    { maxWidth: 170 }
  );

  // Save PDF
  doc.save(`Proposal_${name.replace(/\s+/g, "_")}.pdf`);
});

  /* ==========================
     SKILL MODAL LOGIC
  ========================== */
  const skillInfo = {
    html: { title: "HTML", description: "HTML is the foundation of every website. It structures content such as text, images, forms, and buttons so browsers can display them correctly." },
    css: { title: "CSS", description: "CSS controls the design and layout of a website, including colors, spacing, responsiveness, and animations to create a professional look." },
    js: { title: "JavaScript", description: "JavaScript adds interactivity and logic to websites, enabling features like calculators, forms, animations, and dynamic content." },
    firebase: { title: "Firebase", description: "Firebase provides real-time databases, authentication, and hosting, allowing fast and scalable web and mobile applications." },
    mongodb: { title: "MongoDB", description: "MongoDB is a NoSQL database used to store and manage large amounts of application data efficiently." },
    mongoose: { title: "Mongoose", description: "Mongoose helps structure and manage MongoDB data by enforcing schemas and simplifying database interactions." },
    paystack: { title: "Paystack", description: "Paystack enables secure online payments, allowing businesses to accept cards, bank transfers, and mobile payments." },
    twilio: { title: "Twilio", description: "Twilio powers SMS and WhatsApp notifications, enabling automated reminders and customer communication." },
    render: { title: "Render", description: "Render is a cloud platform used to deploy and host web applications securely with automatic scaling." }
  };

  const modal = document.getElementById("skill-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-description");
  const modalClose = modal?.querySelector(".modal-close");

  if (modal && modalTitle && modalDesc && modalClose) {
    document.querySelectorAll(".skills span").forEach(skill => {
      skill.addEventListener("click", () => {
        const key = skill.dataset.skill;
        if (!key || !skillInfo[key]) return;
        modalTitle.textContent = skillInfo[key].title;
        modalDesc.textContent = skillInfo[key].description;
        modal.classList.add("show");
      });
    });

    modalClose.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });
  }

/* ==========================
   MOBILE NAV TOGGLE
========================== */
const menuBtn = document.getElementById("menu-btn");
const nav = document.querySelector("header nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    nav.classList.toggle("show");

    // Icon swap
    menuBtn.textContent = nav.classList.contains("show") ? "✕" : "☰";
  });

  // Close when clicking a link
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
      menuBtn.textContent = "☰";
    });
  });

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove("show");
      menuBtn.textContent = "☰";
    }
  });
}

});
