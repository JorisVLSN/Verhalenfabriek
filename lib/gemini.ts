import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export { genAI };

export async function generateStory(messages: { role: string; content: string }[], systemPrompt: string) {
  const contents = messages.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...contents
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 500,
    }
  });

  return result.text || "Oeps, Professor Pluis is even bezig met haar toverstaf. Probeer het opnieuw! ✨";
}

export async function generateImage(prompt: string): Promise<string> {
  const result = await genAI.models.generateContent({
    model: "imagen-4.0-fast",
    contents: prompt,
    generationConfig: {
      responseModalities: ["Text", "Image"]
    }
  });

  // In productie: afbeelding opslaan en URL teruggeven
  // Voor nu: placeholder
  return "/placeholder-illustration.jpg";
}
