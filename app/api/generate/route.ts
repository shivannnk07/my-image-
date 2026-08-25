import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

const SPACE_ID = "shivank999/mera-image-generator";

export async function POST(req: NextRequest) {
  const { prompt, steps, guidance } = await req.json();

  if (!prompt || String(prompt).trim() === "") {
    return NextResponse.json({ error: "Prompt khali nahi ho sakta" }, { status: 400 });
  }

  try {
    // HF_TOKEN comes from Vercel Environment Variables — never in the code
    const client = await Client.connect(SPACE_ID, { hf_token: process.env.HF_TOKEN as any });

    const result = await client.predict("/generate", [
      prompt,
      Number(steps) || 30,
      Number(guidance) || 3.5,
    ]);

    const output = (result.data as any)[0];
    const imageUrl = typeof output === "string" ? output : output?.url || output?.path;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL nahi mili backend response mein" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Kuch galat ho gaya" }, { status: 500 });
  }
}
