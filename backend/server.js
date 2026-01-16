import express from "express";
import cors from "cors";
import emailjs from "@emailjs/nodejs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json());

// Enable CORS (optional if frontend is served from same origin)
app.use(cors());

// Initialize EmailJS
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      { name, email, message }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// Serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "portfolio/index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
