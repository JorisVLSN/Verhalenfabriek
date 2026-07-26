import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { databaseRequest, isDatabaseConfigured } from "@/lib/database";
import { children } from "@/lib/children";
import type { StoredStory } from "@/lib/story-storage";
import { friendBookEntries } from "@/lib/friends-book";

interface StoryRow {
  id: string;
  child_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: StoredStory["messages"];
  current_phase?: number;
  resident_id?: string;
  source?: StoredStory["source"];
  daily_date_key?: string;
  daily_signature?: string;
}

export async function GET(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return Response.json({ configured: false, stories: [] });
  }

  const childId = req.nextUrl.searchParams.get("childId");
  if (!childId || !children.some((child) => child.id === childId)) {
    return Response.json({ error: "Onbekende boekenplank." }, { status: 400 });
  }

  const rows = await databaseRequest<StoryRow[]>(
    `stories?child_id=eq.${encodeURIComponent(childId)}&order=updated_at.desc`
  );
  return Response.json({
    configured: true,
    stories: rows.map(fromRow),
  });
}

export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return Response.json({ configured: false });
  }

  const story = (await req.json()) as StoredStory;
  if (
    !story?.id ||
    !children.some((child) => child.id === story.childId) ||
    !Array.isArray(story.messages)
  ) {
    return Response.json({ error: "Ongeldig verhaal." }, { status: 400 });
  }

  await databaseRequest<unknown>("stories?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(toRow(story)),
  });

  if ((story.currentPhase ?? 0) >= 6 && story.source !== "courtyard-daily") {
    await discoverCharacterSuggestion(story).catch((error) =>
      console.error("Character discovery skipped:", error)
    );
  }

  return Response.json({ configured: true, saved: true });
}

export async function DELETE(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return Response.json({ configured: false });
  }

  const storyId = req.nextUrl.searchParams.get("id");
  const childId = req.nextUrl.searchParams.get("childId");
  if (!storyId || !childId) {
    return Response.json({ error: "Verhaal ontbreekt." }, { status: 400 });
  }

  await databaseRequest<unknown>(
    `stories?id=eq.${encodeURIComponent(storyId)}&child_id=eq.${encodeURIComponent(
      childId
    )}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } }
  );
  return Response.json({ deleted: true });
}

function toRow(story: StoredStory): StoryRow {
  return {
    id: story.id,
    child_id: story.childId,
    title: story.title,
    created_at: story.createdAt,
    updated_at: story.updatedAt,
    messages: story.messages,
    current_phase: story.currentPhase,
    resident_id: story.residentId,
    source: story.source ?? "created",
    daily_date_key: story.dailyDateKey,
    daily_signature: story.dailySignature,
  };
}

function fromRow(row: StoryRow): StoredStory {
  return {
    id: row.id,
    childId: row.child_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: row.messages,
    currentPhase: row.current_phase,
    residentId: row.resident_id,
    source: row.source,
    dailyDateKey: row.daily_date_key,
    dailySignature: row.daily_signature,
  };
}

async function discoverCharacterSuggestion(story: StoredStory) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return;
  const child = children.find((candidate) => candidate.id === story.childId);
  if (!child) return;

  const conversation = story.messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")
    .slice(0, 12000);
  const ai = new GoogleGenAI({ apiKey });
  const knownCharacters = friendBookEntries.map((entry) => entry.name).join(", ");
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Onderzoek dit kinderverhaal uitsluitend op een NIEUW personage dat ${child.name} zelf duidelijk heeft bedacht.
Negeer bekende personen en deze bestaande bewoners: ${knownCharacters}.
Verzin en vervolledig niets.
Als er geen duidelijke ontdekking is, antwoord exact: null
Anders antwoord uitsluitend als JSON:
{"name":"...","species":"... of null","likes":["alleen letterlijk genoemd"],"traits":["alleen letterlijk gebleken"],"evidence":"korte letterlijke samenvatting"}

GESPREK:
${conversation}`,
    config: {
      temperature: 0.1,
      maxOutputTokens: 500,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
    },
  });

  const raw = result.text?.trim();
  if (!raw || raw === "null") return;
  const suggestion = JSON.parse(raw) as {
    name?: string;
    species?: string | null;
    likes?: string[];
    traits?: string[];
    evidence?: string;
  };
  if (!suggestion.name || !suggestion.evidence) return;

  await databaseRequest<unknown>(
    "character_suggestions?on_conflict=child_id,suggested_name,source_story_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        child_id: story.childId,
        suggested_name: suggestion.name.slice(0, 100),
        species: suggestion.species?.slice(0, 100) ?? null,
        likes: Array.isArray(suggestion.likes) ? suggestion.likes.slice(0, 8) : [],
        traits: Array.isArray(suggestion.traits)
          ? suggestion.traits.slice(0, 8)
          : [],
        evidence: suggestion.evidence.slice(0, 1000),
        source_story_id: story.id,
      }),
    }
  );
}
