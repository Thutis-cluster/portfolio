import express from "express";
import cors from "cors";
import emailjs from "@emailjs/nodejs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Enable JSON body parsing
app.use(express.json());
app.use(cors());

// Initialize EmailJS with your public key from Render environment variables
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
});

// POST endpoint for contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Optional: log request payload to make sure it's correct
  console.log("Received contact form:", { name, email, message });

  try {
    // Send email using EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        name,   // matches template variable {{name}}
        email,  // matches template variable {{email}}
        message // matches template variable {{message}}
      }
    );

    console.log("✅ Email sent successfully!");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ EmailJS send error:", error);
    res.status(500).json({ success: false });
  }
});

// SPA support: send index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "portfolio/index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
