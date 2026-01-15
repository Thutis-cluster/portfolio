import express from "express";
import emailjs from "@emailjs/nodejs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

app.post("/contact", async (req, res) => {
  try {
    await emailjs.send(
      process.env.SERVICE_ID,
      process.env.TEMPLATE_ID,
      req.body
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(3000);
