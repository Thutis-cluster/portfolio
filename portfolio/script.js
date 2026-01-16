import express from "express";
import cors from "cors";
import emailjs from "@emailjs/nodejs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files from the "portfolio" folder
app.use(express.static(path.join(__dirname, "portfolio")));

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Initialize EmailJS with public key
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
});

// POST endpoint for contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("📩 Received contact form:", { name, email, message });

  try {
    const templateParams = {
      name,    // must match template variable in EmailJS
      email,   // must match template variable in EmailJS
      message, // must match template variable in EmailJS
    };

    console.log("📤 Sending email with template params:", templateParams);

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log("✅ EmailJS response:", response);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ EmailJS send error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPA support: serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "portfolio/index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

