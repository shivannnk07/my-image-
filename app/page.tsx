"use client";

import React, { useState } from "react";
import { GenerateButton } from "@/components/ui/generate-button";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(3.5);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  async function handleGenerate() {
    setError("");
    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, steps, guidance }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setImageUrl(data.imageUrl);
      setModalOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err?.message || String(err)));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-3xl font-semibold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          My AI Image Generator
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Your own free, self-hosted AI image tool
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#17171f] border border-[#2a2a35] rounded-2xl p-6">
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a majestic lion in a sunset forest, cinematic lighting"
              className="w-full bg-[#0f0f14] border border-[#2a2a35] rounded-lg text-[#eaeaea] p-3 text-sm min-h-[80px] resize-none"
            />

            <div className="mt-4">
              <label className="text-sm text-gray-400 block mb-1.5">
                Quality steps <span className="float-right text-purple-400 text-sm">{steps}</span>
              </label>
              <input
                type="range"
                min={10}
                max={50}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-400 block mb-1.5">
                Guidance scale <span className="float-right text-purple-400 text-sm">{guidance}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={guidance}
                onChange={(e) => setGuidance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-5">
              <GenerateButton
                hue={280}
                isGenerating={isGenerating}
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full"
              />
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-[#0f0f14] border border-[#2a2a35] rounded-lg min-h-[300px] flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setModalOpen(true)}
              />
            ) : (
              <p className="text-gray-500 text-sm text-center px-4">
                {isGenerating ? "Generating, please wait..." : "Your generated image will appear here"}
              </p>
            )}
          </div>
        </div>
      </div>

      {modalOpen && imageUrl && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none px-2"
            >
              &times;
            </button>
            <img
              src={imageUrl}
              alt="Generated"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl block"
            />
          </div>
        </div>
      )}
    </main>
  );
}
