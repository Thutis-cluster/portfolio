import express from "express";
import cors from "cors";
import emailjs from "@emailjs/nodejs";

const app = express();

app.use(cors());
app.use(express.json());

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
});

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

app.listen(process.env.PORT || 3000);
