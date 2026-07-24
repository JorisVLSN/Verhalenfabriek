import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { children } from "@/lib/children";
import {
  buildResidentContext,
  getResidentCanon,
  ResidentId,
} from "@/lib/resident-canon";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const {
      childId,
      speakerId,
      subjectId,
      theme,
      previousStories = [],
    } = await req.json();
    const child = children.find((candidate) => candidate.id === childId);
    const speaker = getResidentCanon(speakerId);
    const subject = getResidentCanon(subjectId);

    if (!child || !speaker || !subject || speaker.id === subject.id) {
      return Response.json({ error: "Ongeldig dagverhaal." }, { status: 400 });
    }

    const lengthInstruction =
      child.age <= 4
        ? "Schrijf 5 zeer korte zinnen met eenvoudige woorden."
        : child.id === "pauline"
          ? "Schrijf 7 korte, leesvriendelijke zinnen met veel witruimte. Gebruik hoogstens één moeilijk woord en leg het meteen eenvoudig uit."
          : child.age <= 7
            ? "Schrijf 8 korte zinnen in kleine alinea's."
            : "Schrijf 10 tot 12 rustige zinnen in korte alinea's.";
    const previousStoryContext = Array.isArray(previousStories)
      ? previousStories
          .slice(0, 20)
          .map(
            (story: { title?: string; excerpt?: string }, index: number) =>
              `${index + 1}. ${String(story.title ?? "").slice(0, 120)} — ${String(
                story.excerpt ?? ""
              ).slice(0, 280)}`
          )
          .join("\n")
      : "";

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${buildResidentContext(
        speaker.id as ResidentId,
        subject.id as ResidentId
      )}

OPDRACHT:
${speaker.name} vertelt aan ${child.name} een volledig, afgerond en veilig verhaal over ${subject.name}.
Thema: ${String(theme).slice(0, 120)}.
${lengthInstruction}
Vertel in de ik-vorm van ${speaker.name}.
Gebruik alleen gebeurtenissen die passen bij de canon en hun beschreven relatie.
Maak geen nieuw permanent achtergrondfeit. Vermijd privégegevens, angstige inhoud en lessen die belerend klinken.
${previousStoryContext
  ? `EERDERE DAGVERHALEN VOOR DIT KIND:\n${previousStoryContext}\nBedenk een duidelijk andere gebeurtenis, locatie, opening en afloop. Herhaal geen grap, probleem of oplossing uit deze verhalen.`
  : "Dit is het eerste dagverhaal voor dit kind."}
Geef alleen het verhaal, zonder titel, kopjes of nabespreking.`,
      config: {
        temperature: 0.9,
        maxOutputTokens: 1400,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = result.text?.trim();
    if (!text) throw new Error("Empty daily story");

    return Response.json({ text });
  } catch (error) {
    console.error("Daily courtyard story error:", error);
    return Response.json(
      { error: "Het verhaal is nog niet helemaal aangekomen. Probeer zo opnieuw." },
      { status: 500 }
    );
  }
}
