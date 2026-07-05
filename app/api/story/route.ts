import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { children } from "@/lib/children";
import { professorPluisSystemPrompt } from "@/lib/professor-pluis";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, childId, phase } = await req.json();

    const child = children.find((c) => c.id === childId) ?? children[0];

    const systemPrompt = professorPluisSystemPrompt(
      child.name,
      child.age,
      child.style
    );

    // Bouw de conversatie op voor Gemini
    const contents = [];

    // System prompt als eerste user message (Gemini heeft geen aparte system role)
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt + "

/n/nDit is jouw rol. Beantwoord nu het volgende:" }]
    });

    contents.push({
      role: "model",
      parts: [{ text: "Begrepen! Ik ben Professor Pluis en ik help graag met het maken van magische verhalen." }]
    });

    // Voeg de gespreksgeschiedenis toe
    for (const msg of messages) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    }

    // Genereer streaming response
    const result = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 400,
        topP: 0.95,
      },
    });

    // Stream de response terug
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}

`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Story generation error:", error);
    return Response.json(
      { error: "Professor Pluis is even bezig met haar toverstaf. Probeer het opnieuw! ✨" },
      { status: 500 }
    );
  }
}
