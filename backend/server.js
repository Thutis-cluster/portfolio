import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../"))); // adjust path if needed

// Route to provide EmailJS config (frontend safe)
app.get("/emailjs-config", (req, res) => {
  res.json({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,   // safe to expose
    serviceId: process.env.EMAILJS_SERVICE_ID,   // optional if you want backend to manage
    templateId: process.env.EMAILJS_TEMPLATE_ID // optional if you want backend to manage
  });
});

// Fallback to index.html for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html")); // adjust path
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
