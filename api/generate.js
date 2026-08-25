// Ye Vercel serverless function hai — server pe chalta hai, browser mein nahi.
// HF_TOKEN kabhi bhi user ke browser tak nahi pahunchta, sirf yahan (server) use hota hai.
import { Client } from "@gradio/client";

const SPACE_ID = "shivank999/mera-image-generator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sirf POST method allowed hai" });
  }

  const { prompt, steps, guidance } = req.body || {};

  if (!prompt || String(prompt).trim() === "") {
    return res.status(400).json({ error: "Prompt khali nahi ho sakta" });
  }

  try {
    // HF_TOKEN Vercel ke Environment Variables se aata hai — code mein kahin likha nahi hai
    const client = await Client.connect(SPACE_ID, { hf_token: process.env.HF_TOKEN });

    const result = await client.predict("/generate", [
      prompt,
      Number(steps) || 30,
      Number(guidance) || 3.5,
    ]);

    const output = result.data[0];
    const imageUrl = typeof output === "string" ? output : (output?.url || output?.path);

    if (!imageUrl) {
      return res.status(500).json({ error: "Image URL nahi mili backend response mein" });
    }

    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Kuch galat ho gaya" });
  }
}
