import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json(
        { error: "Geen geldige prompt ontvangen." },
        { status: 400 }
      );
    }

    const safePrompt = `
Maak een kindvriendelijke, warme illustratie voor de Verhalenfabriek.

Stijl:
- vrolijk
- magisch
- zacht
- niet eng
- geschikt voor kinderen van 4 tot 10 jaar

Illustratie:
${prompt}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: safePrompt,
    });

    const text = response.text ?? "";

    return Response.json({
      text,
      imageUrl: null,
      message:
        "Afbeeldingen zijn tijdelijk uitgeschakeld. Professor Pluis kan wel al een beschrijving maken.",
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return Response.json(
      {
        error:
          "Professor Pluis kon de tekening even niet maken. Probeer het later opnieuw! ✨",
      },
      { status: 500 }
    );
  }
}
