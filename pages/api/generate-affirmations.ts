import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Initialize OpenAI client using the specified environment variable
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Define the expected input schema
const InputSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty" }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" })
    .max(80, { message: "Quantity cannot exceed 80" }),
});

// Define the desired output structure using Zod
const AffirmationResponse = z
  .object({
    affirmations: z
      .array(
        z
          .string()
          .describe(
            "A single positive affirmation, ideally starting with 'I am...' or similar."
          )
      )
      .describe(
        "An array containing the generated affirmations based on the prompt."
      ),
  })
  .describe("A list of generated positive affirmations.");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Validate input body
    const parseResult = InputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { prompt, quantity } = parseResult.data;

    console.log(`Generating ${quantity} affirmations for prompt: "${prompt}"`);

    // Make the OpenAI API call using the beta parse helper
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4.1-nano", // Or another suitable model like gpt-3.5-turbo
      messages: [
        {
          role: "system",
          content: `You are an expert in crafting positive affirmations. Generate exactly ${quantity} distinct affirmations based on the user's prompt. Ensure they are concise, positive, and primarily in the first person (e.g., 'I am...', 'I embrace...', 'I attract...'). Respond *only* with the structured JSON format requested.`,
        },
        {
          role: "user",
          content: `Generate ${quantity} affirmations about: ${prompt}`,
        },
      ],
      // Use zodResponseFormat to enforce the structure
      response_format: zodResponseFormat(
        AffirmationResponse,
        "affirmation_list"
      ),
    });

    // Check for refusal
    const message = completion.choices[0]?.message;
    if (!message) {
      throw new Error("Invalid response from OpenAI");
    }

    if (message.refusal) {
      console.error(
        "OpenAI refused to generate affirmations:",
        message.refusal
      );
      return res.status(500).json({
        error: "Failed to generate affirmations due to refusal.",
        details: message.refusal,
      });
    }

    const parsedResponse = message.parsed;
    if (!parsedResponse) {
      throw new Error("Failed to parse response from OpenAI");
    }

    let finalAffirmations = parsedResponse.affirmations;

    // Truncate the array if the model generated more than requested
    if (finalAffirmations.length > quantity) {
      console.warn(
        `OpenAI generated ${finalAffirmations.length} affirmations, truncating to requested ${quantity}.`
      );
      finalAffirmations = finalAffirmations.slice(0, quantity);
    }

    console.log("Generated affirmations (final count):", finalAffirmations);

    // Send the successful response with the potentially truncated array
    return res.status(200).json({ affirmations: finalAffirmations });
  } catch (error: unknown) {
    console.error("API Error:", error);
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    // Consider more specific error handling based on OpenAI error types if needed
    return res.status(500).json({
      error: "Failed to generate affirmations",
      details: errorMessage,
    });
  }
}
