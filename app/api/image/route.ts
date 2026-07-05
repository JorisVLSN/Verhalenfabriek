import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, childAge } = await req.json();

    // Maak de prompt kindvriendelijk en veilig
    const safePrompt = `Een kindvriendelijke, magische illustratie voor een verhaal: ${prompt}. 
    Stijl: warme waterverf, zachte kleuren, fantasievol, geschikt voor kinderen van ${childAge} jaar.
    Geen enge, gewelddadige of volwassen elementen. Vrolijk en hoopvol.`;

    const result = await genAI.models.generateContent({
      model: "imagen-4.0-fast",
      contents: safePrompt,
      generationConfig: {
        responseModalities: ["Text", "Image"]
      }
    });

    // Extract image data (base64)
    const parts = result.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart?.inlineData?.data) {
      return Response.json({
        imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`,
        success: true
      });
    }

    // Fallback als er geen afbeelding is
    return Response.json({
      imageUrl: null,
      success: false,
      message: "Professor Pluis is haar verfstiften aan het zoeken..."
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return Response.json(
      { error: "De magische illustratie-machine doet het even niet. Probeer later opnieuw! 🎨" },
      { status: 500 }
    );
  }
}
