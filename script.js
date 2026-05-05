document.addEventListener("DOMContentLoaded", async () => {

  /* ==========================
     EMAILJS INIT
  ========================== */
  try {
    const res = await fetch("/emailjs-config");
    const data = await res.json();

    emailjs.init(data.publicKey);
    window.EMAIL_CONFIG = data;

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
     POPUP
  ========================== */
  function showPopup(message, success = true) {
    const popup = document.getElementById("popup");
    if (!popup) return;

    popup.textContent = message;
    popup.style.background = success ? "#00c851" : "#ff4444";
    popup.classList.add("show");

    setTimeout(() => popup.classList.remove("show"), 4000);
  }

  /* ==========================
     DARK MODE
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

      siteTypeInput.value =
        `${card.querySelector("h3").textContent} (${priceText})`;

      updateTotal();

      calculator?.scrollIntoView({ behavior: "smooth" });
    });
  });

  extrasCheckboxes.forEach(cb =>
    cb.addEventListener("change", updateTotal)
  );

  updateTotal();

  /* ==========================
     RECOMMENDED EXTRAS
  ========================== */
  const extraLabels = document.querySelectorAll(".calculator fieldset label");

  function clearRecommendations() {
    extraLabels.forEach(label =>
      label.classList.remove("recommended")
    );
  }

  priceCards.forEach(card => {
    const btn = card.querySelector(".select-price");

    btn.addEventListener("click", () => {
      clearRecommendations();

      const title = card.querySelector("h3").textContent.toLowerCase();

      if (title.includes("basic")) {
        extraLabels[0]?.classList.add("recommended");
        extraLabels[1]?.classList.add("recommended");
        extraLabels[2]?.classList.add("recommended");
        extraLabels[3]?.classList.add("recommended");
      }

      if (title.includes("business")) {
        extraLabels[0]?.classList.add("recommended");
        extraLabels[2]?.classList.add("recommended");
        extraLabels[3]?.classList.add("recommended");
      }

      if (title.includes("commerce")) {
        extraLabels[0]?.classList.add("recommended");
        extraLabels[1]?.classList.add("recommended");
      }
    });
  });

  /* ==========================
     CONTACT FORM + PDF
  ========================== */
  const form = document.getElementById("contact-form");

  function generateProposalPDF() {
    const { jsPDF } = window.jspdf;

    const name = form.name.value || "Client";
    const email = form.email.value || "N/A";
    const phone = form.phone.value || "N/A";
    const message = form.message.value || "No message";
    const estimate =
      document.getElementById("estimated_total").value || "R0";
    const selectedPackage = siteTypeInput.value || "Not selected";

    const extras =
      Array.from(extrasCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim())
        .join(", ") || "None";

    const today = new Date();
    const invoiceNumber =
      "KRK-" +
      today.getFullYear() +
      Math.floor(1000 + Math.random() * 9000);

    const doc = new jsPDF();

    doc.text("PROJECT PROPOSAL", 20, 20);
    doc.text(`Client: ${name}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text(`Phone: ${phone}`, 20, 60);
    doc.text(`Package: ${selectedPackage}`, 20, 80);
    doc.text(`Extras: ${extras}`, 20, 90);
    doc.text(`Total: ${estimate}`, 20, 110);

    doc.save(`Invoice_${invoiceNumber}.pdf`);
  }

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      if (form.company.value) return;

      document.getElementById("estimated_total").value =
        totalEl.textContent;

      document.getElementById("email_package").value =
        siteTypeInput.value;

      document.getElementById("email_extras").value =
        Array.from(extrasCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.parentElement.textContent.trim())
          .join(", ") || "None";

      const btn = form.querySelector("button[type='submit']");
      btn.disabled = true;
      btn.textContent = "Sending...";

      emailjs.sendForm(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        form
      )
      .then(() => {
        generateProposalPDF();
        form.reset();
        showPopup("✅ Proposal sent & downloaded!");
      })
      .catch(() => {
        showPopup("❌ Failed to send message", false);
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = "Send Message";
      });
    });
  }

  /* ==========================
     MOBILE NAV
  ========================== */
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.querySelector("header nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", e => {
      e.stopPropagation();

      nav.classList.toggle("active");
      menuBtn.textContent =
        nav.classList.contains("active") ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
      });
    });

    document.addEventListener("click", e => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
      }
    });
  }

});
