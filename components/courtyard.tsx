"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { children } from "@/lib/children";
import {
  createDailyStoryPlan,
  DailyStoryPlan,
  findDailyStory,
} from "@/lib/courtyard";
import {
  residentCanon,
  ResidentCanon,
  ResidentId,
} from "@/lib/resident-canon";
import {
  getStoredStories,
  saveStoredStory,
  StoredStory,
} from "@/lib/story-storage";
import {
  ReadAloudButton,
  VoiceAnswerButton,
} from "@/components/story-accessibility";

interface CourtyardMessage {
  role: "user" | "assistant";
  content: string;
}

export function Courtyard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get("child");
  const child = children.find((candidate) => candidate.id === childId);
  const [dailyPlan, setDailyPlan] = useState<DailyStoryPlan | null>(null);
  const [dailyStory, setDailyStory] = useState<StoredStory | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");
  const [activeResident, setActiveResident] = useState<ResidentCanon | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<CourtyardMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const residents = useMemo(
    () => Object.values(residentCanon),
    []
  );

  useEffect(() => {
    if (!child) {
      router.replace("/ontdekker?next=courtyard");
      return;
    }

    const stories = getStoredStories();
    setDailyStory(findDailyStory(stories, child.id) ?? null);
    setDailyPlan(createDailyStoryPlan(child.id, stories));
  }, [child, router]);

  if (!child || !dailyPlan) return null;

  const featuredResident = residentCanon[dailyPlan.speakerId];
  const subjectResident = residentCanon[dailyPlan.subjectId];
  const canListen = child.id === "pauline" || child.id === "mats";
  const canUseVoice = child.id === "mats";

  const openChat = (resident: ResidentCanon) => {
    setActiveResident(resident);
    setChatError("");
    setChatInput("");
    setChatMessages([
      {
        role: "assistant",
        content: getResidentWelcome(resident, child.name),
      },
    ]);
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || !activeResident || chatLoading) return;

    const nextMessages: CourtyardMessage[] = [
      ...chatMessages,
      { role: "user", content: text },
    ];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    setChatError("");

    try {
      const response = await fetch("/api/courtyard/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          residentId: activeResident.id,
          messages: nextMessages,
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) {
        throw new Error(data.error ?? "Geen antwoord ontvangen");
      }
      setChatMessages((current) => [
        ...current,
        { role: "assistant", content: data.text! },
      ]);
    } catch (error) {
      setChatError(
        error instanceof Error ? error.message : "Probeer het zo nog eens."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const createDailyStory = async () => {
    if (dailyStory || dailyLoading) return;
    setDailyLoading(true);
    setDailyError("");

    try {
      const previousStories = getStoredStories()
        .filter(
          (story) =>
            story.childId === child.id && story.source === "courtyard-daily"
        )
        .slice(0, 20)
        .map((story) => ({
          title: story.title,
          excerpt: story.messages[0]?.content.slice(0, 280) ?? "",
        }));

      const response = await fetch("/api/courtyard/daily-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          speakerId: dailyPlan.speakerId,
          subjectId: dailyPlan.subjectId,
          theme: dailyPlan.theme,
          previousStories,
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) {
        throw new Error(data.error ?? "Geen verhaal ontvangen");
      }

      const now = new Date().toISOString();
      const story: StoredStory = {
        id: crypto.randomUUID(),
        childId: child.id,
        title: `${featuredResident.name} vertelt over ${subjectResident.name}`,
        createdAt: now,
        updatedAt: now,
        messages: [{ role: "assistant", content: data.text }],
        source: "courtyard-daily",
        dailyDateKey: dailyPlan.dateKey,
        dailySignature: dailyPlan.signature,
        residentId: featuredResident.id,
      };

      saveStoredStory(story);
      setDailyStory(story);
    } catch (error) {
      setDailyError(
        error instanceof Error ? error.message : "Probeer het zo nog eens."
      );
    } finally {
      setDailyLoading(false);
    }
  };

  return (
    <main className="courtyard-page">
      <div className="courtyard-sun" aria-hidden="true" />
      <nav className="courtyard-nav" aria-label="Binnenplaats navigatie">
        <Link href="/" className="courtyard-back">
          <ArrowLeft size={18} />
          Naar de voordeur
        </Link>
        <Link
          href={`/library?child=${child.id}`}
          className="courtyard-library-link"
        >
          <BookOpen size={18} />
          Mijn boekenplank
        </Link>
      </nav>

      <header className="courtyard-header">
        <p>Wat fijn dat je er bent, {child.name}</p>
        <h1>De Binnenplaats</h1>
        <span>
          Hier rusten de bewoners uit, delen ze nieuwtjes en wachten ze op een
          korte babbel.
        </span>
      </header>

      <section
        className="courtyard-feature"
        aria-labelledby="featured-resident-title"
      >
        <div className="courtyard-feature-portrait" aria-hidden="true">
          {featuredResident.emoji}
        </div>
        <div>
          <p className="courtyard-feature-label">
            <Sparkles size={16} />
            Vandaag in het zonnetje
          </p>
          <h2 id="featured-resident-title">{featuredResident.name}</h2>
          <p>
            {featuredResident.name} heeft vandaag een verhaal over{" "}
            <strong>{subjectResident.name}</strong> voor {child.name}.
          </p>
          {!dailyStory ? (
            <button
              type="button"
              onClick={createDailyStory}
              disabled={dailyLoading}
              className="courtyard-story-button"
            >
              {dailyLoading ? (
                <Loader2 className="animate-spin" size={19} />
              ) : (
                <BookOpen size={19} />
              )}
              {dailyLoading ? "Het verhaal komt eraan…" : "Vertel het verhaal van vandaag"}
            </button>
          ) : (
            <div className="courtyard-daily-story">
              <h3>{dailyStory.title}</h3>
              <p>{dailyStory.messages[0]?.content}</p>
              <div className="courtyard-story-actions">
                {canListen && (
                  <ReadAloudButton
                    text={`${dailyStory.title}. ${dailyStory.messages[0]?.content ?? ""}`}
                  />
                )}
                <Link href={`/library?child=${child.id}`}>
                  Staat in mijn boekenplank →
                </Link>
              </div>
            </div>
          )}
          {dailyError && <p className="courtyard-error">{dailyError}</p>}
        </div>
      </section>

      <section className="courtyard-residents" aria-labelledby="residents-title">
        <div className="courtyard-section-heading">
          <p>Wie zie je vandaag?</p>
          <h2 id="residents-title">De bewoners op de binnenplaats</h2>
        </div>
        <div className="courtyard-resident-grid">
          {residents.map((resident) => (
            <article
              key={resident.id}
              className={`courtyard-resident ${
                resident.id === featuredResident.id ? "is-featured" : ""
              }`}
            >
              <span className="courtyard-resident-emoji" aria-hidden="true">
                {resident.emoji}
              </span>
              <h3>{resident.name}</h3>
              <p>{resident.role}</p>
              <button
                type="button"
                onClick={() => openChat(resident)}
                aria-label={`Sla een korte babbel met ${resident.name}`}
              >
                <MessageCircle size={17} />
                Even praten
              </button>
            </article>
          ))}
        </div>
      </section>

      {activeResident && (
        <section
          className="courtyard-chat-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="courtyard-chat-title"
        >
          <div className="courtyard-chat">
            <header>
              <span aria-hidden="true">{activeResident.emoji}</span>
              <div>
                <small>Een korte babbel met</small>
                <h2 id="courtyard-chat-title">{activeResident.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveResident(null)}
                aria-label="Sluit het gesprek"
              >
                <X />
              </button>
            </header>

            <div className="courtyard-chat-messages" aria-live="polite">
              {chatMessages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={message.role}
                >
                  <p>{message.content}</p>
                  {message.role === "assistant" && canListen && (
                    <ReadAloudButton text={message.content} />
                  )}
                </article>
              ))}
              {chatLoading && (
                <div className="courtyard-chat-thinking">
                  <Loader2 className="animate-spin" />
                  {activeResident.name} denkt even na…
                </div>
              )}
            </div>

            {chatError && <p className="courtyard-error">{chatError}</p>}

            <div className="courtyard-chat-input">
              {canUseVoice && (
                <VoiceAnswerButton
                  disabled={chatLoading}
                  onTranscript={setChatInput}
                />
              )}
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendChatMessage();
                  }
                }}
                placeholder="Zeg iets vriendelijks…"
                disabled={chatLoading}
                aria-label={`Praat met ${activeResident.name}`}
              />
              <button
                type="button"
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                aria-label="Verstuur bericht"
              >
                <Send />
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function getResidentWelcome(resident: ResidentCanon, childName: string) {
  const welcomes: Partial<Record<ResidentId, string>> = {
    "professor-pluis": `Ik heb stiekem al op je gewacht, ${childName}. Wat fijn dat je even naar de binnenplaats komt.`,
    "meneer-inkt": `Dag ${childName}. Ik was net een bladzijde aan het zoeken. Of wilde die bladzijde misschien mij vinden?`,
    driekoppig: `Dag ${childName}! Zonnestraal, Donderwolk en Speurpoes zijn het eens: wij zijn blij je te zien!`,
    pluiziebol: `Hallo ${childName}. Kom gerust even zitten. Hier is altijd een zacht plekje vrij.`,
    "dokter-pen": `Dag ${childName}! Ik controleerde net of alle boeken zich vandaag goed voelen.`,
    "juffrouw-andersom": `Goedenacht, ${childName}! O, wacht… ik bedoel natuurlijk goedendag!`,
    "karel-kraa": `Ha, ${childName}! Ik heb vandaag minstens duizend avonturen gezien. Of waren het er misschien drie?`,
  };
  return welcomes[resident.id] ?? `Hallo ${childName}, wat fijn dat je er bent.`;
}
