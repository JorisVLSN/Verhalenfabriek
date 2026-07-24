import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { children } from "@/lib/children";
import { professorPluisSystemPrompt } from "@/lib/professor-pluis";
import { getResident } from "@/lib/residents";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, childId, residentId } = await req.json();

    const child = children.find((c) => c.id === childId) ?? children[0];

    const systemPrompt = professorPluisSystemPrompt(
      child.name,
      child.age,
      child.style
    );
    const resident = getResident(residentId);
    const residentPrompt = resident
      ? `\n\nVASTE VERHAALVRIEND:\n${resident.name} gaat vandaag mee als helper.\n${resident.storyRole}\nLaat ${resident.name} herkenbaar meedoen, maar laat het kind altijd de held en beslisser blijven.`
      : "";

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}${residentPrompt}\n\nDit is jouw rol. Beantwoord nu het volgende:`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Begrepen! Ik ben Professor Pluis en ik help graag met het maken van magische verhalen.",
          },
        ],
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        temperature: 0.9,
        maxOutputTokens: 1000,
        topP: 0.95,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const text = result.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty story response");
    }

    return Response.json({ text });
  } catch (error) {
    console.error("Story generation error:", error);

    return Response.json(
      {
        error:
          "Professor Pluis is even bezig met haar toverstaf. Probeer het opnieuw! ✨",
      },
      { status: 500 }
    );
  }
}
