"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { children } from "@/lib/children";
import { getAvailableStories } from "@/lib/story-storage";
import { DiscovererCard } from "@/components/discoverer-card";
import { ProfessorGreeting } from "@/components/professor-greeting";
import { professorQuotes, QuoteCard } from "@/components/quote-card";

const discovererDetails: Record<
  string,
  { icon: string; colorClass: string; emptyStory: string }
> = {
  mila: {
    icon: "✦",
    colorClass: "discoverer-mila",
    emptyStory: "Een nieuw avontuur wacht op Mila",
  },
  ellie: {
    icon: "♥",
    colorClass: "discoverer-ellie",
    emptyStory: "Een nieuw avontuur wacht op Ellie",
  },
  pauline: {
    icon: "❀",
    colorClass: "discoverer-pauline",
    emptyStory: "Een nieuw avontuur wacht op Pauline",
  },
  mats: {
    icon: "☀",
    colorClass: "discoverer-mats",
    emptyStory: "Een nieuw avontuur wacht op Mats",
  },
  axelle: {
    icon: "✧",
    colorClass: "discoverer-axelle",
    emptyStory: "Een nieuw avontuur wacht op Axelle",
  },
  louie: {
    icon: "☁",
    colorClass: "discoverer-louie",
    emptyStory: "Een nieuw avontuur wacht op Louie",
  },
};

export function DiscovererEntrance() {
  const searchParams = useSearchParams();
  const requestedDestination = searchParams.get("next");
  const destination =
    requestedDestination === "library"
      ? "library"
      : requestedDestination === "courtyard"
        ? "binnenplaats"
        : "story";
  const [lastStories, setLastStories] = useState<Record<string, string>>({});
  const [showFirstVisitNote, setShowFirstVisitNote] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all(
      children.map((child) => getAvailableStories(child.id))
    ).then((storyCollections) => {
      if (!active) return;
      const newestByChild: Record<string, string> = {};

      for (const story of storyCollections.flat()) {
        if (!newestByChild[story.childId]) {
          newestByChild[story.childId] = story.title;
        }
      }

      setLastStories(newestByChild);
    });
    setQuoteIndex(Math.floor(Math.random() * professorQuotes.length));
    return () => {
      active = false;
    };
  }, []);

  const entries = useMemo(
    () =>
      children.map((child) => ({
        child,
        details: discovererDetails[child.id],
        lastAdventure:
          lastStories[child.id] ??
          discovererDetails[child.id]?.emptyStory ??
          "Een nieuw avontuur staat klaar",
      })),
    [lastStories]
  );

  return (
    <main className="discoverer-page">
      <div className="discoverer-glow discoverer-glow-left" aria-hidden="true" />
      <div className="discoverer-glow discoverer-glow-right" aria-hidden="true" />

      <nav className="discoverer-nav" aria-label="Terug naar de ingang">
        <Link href="/" className="discoverer-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Terug naar de voordeur
        </Link>
      </nav>

      <ProfessorGreeting />

      <section
        className="discoverer-shelf"
        aria-labelledby="discoverer-title"
      >
        {entries.map(({ child, details, lastAdventure }) => (
          <DiscovererCard
            key={child.id}
            name={child.name}
            icon={details?.icon ?? "✦"}
            lastAdventure={lastAdventure}
            href={`/${destination}?child=${child.id}`}
            colorClass={details?.colorClass ?? ""}
          />
        ))}
      </section>

      <section className="first-discoverer" aria-labelledby="first-visit-title">
        <button
          type="button"
          onClick={() => setShowFirstVisitNote((visible) => !visible)}
          aria-expanded={showFirstVisitNote}
          aria-controls="first-visit-note"
        >
          <span className="first-discoverer-icon" aria-hidden="true">
            <Sparkles size={20} />
          </span>
          <span>
            <strong id="first-visit-title">Ik ben hier voor het eerst</strong>
            <small>Professor Pluis leert je graag kennen.</small>
          </span>
        </button>

        {showFirstVisitNote && (
          <p id="first-visit-note">
            Wat fijn dat je er bent. Vraag even aan een grote verhalenmaker om
            samen jouw plekje klaar te maken.
          </p>
        )}
      </section>

      <QuoteCard quote={professorQuotes[quoteIndex]} />
    </main>
  );
}
