import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Ensure your OpenAI API key is set in environment variables
// (using NEXT_PUBLIC_OPENAI_API_KEY as requested, but OPENAI_API_KEY is safer for server-side)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Define available voices (as per OpenAI documentation)
type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
const availableVoices = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // --- Input Handling (Simplified) ---
    const { text, voice, model } = req.body;

    // Basic validation (optional but recommended)
    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error:
          "Invalid input: text is required and must be a non-empty string.",
      });
    }
    // You could add basic checks for voice and model if needed
    const selectedVoice: TTSVoice = voice || "alloy"; // Default voice if not provided
    const selectedModel = model || "gpt-4o-mini-tts"; // Default model changed

    console.log(
      `Generating audio for text: "${text.substring(
        0,
        50
      )}..." with voice: ${selectedVoice}, model: ${selectedModel}`
    );

    // --- OpenAI API Call (Based on Example) ---
    const mp3 = await openai.audio.speech.create({
      model: selectedModel,
      voice: selectedVoice,
      input: text,
      // Instructions are not a standard parameter for this endpoint
      // response_format: 'mp3', // mp3 is the default
    });

    // --- Buffer Conversion (Based on Example) ---
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // --- Response Sending ---
    // Set the response headers for the MP3 file
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);

    // Send the audio buffer as the response body
    return res.send(buffer);

    /* Remove Streaming Logic:
    // Check if the response body exists (for streaming)
    if (!audioResponse.body) {
        throw new Error('Invalid response body from OpenAI TTS API');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    const nodeStream = new Response(audioResponse.body).body;
    if (!nodeStream) {
       throw new Error('Failed to get ReadableStream body');
    }
    const { pipeline } = await import('node:stream/promises');
    await pipeline(nodeStream, res);
    */
  } catch (error: unknown) {
    console.error("API Audio Generation Error:", error);
    let errorMessage = "An unexpected error occurred during audio generation";
    let statusCode = 500;

    if (error instanceof OpenAI.APIError) {
      errorMessage = error.message;
      statusCode = error.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Ensure headers aren't sent before sending JSON error
    if (!res.headersSent) {
      res
        .status(statusCode)
        .json({ error: "Failed to generate audio", details: errorMessage });
    }
  }
}
