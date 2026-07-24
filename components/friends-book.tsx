"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { friendBookEntries } from "@/lib/friends-book";
import { ReadAloudButton } from "@/components/story-accessibility";

export function FriendsBook() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const entry = friendBookEntries[currentIndex];

  const turnPage = (direction: number) => {
    setCurrentIndex((current) => {
      const next = current + direction;
      return (next + friendBookEntries.length) % friendBookEntries.length;
    });
  };

  const readableText = [
    `Dit is ${entry.name}.`,
    `Ontdekt door ${entry.discoveredBy}.`,
    `Woont ${entry.livesAt}.`,
    `Houdt van ${entry.loves}.`,
    `Bijzonder talent: ${entry.talent}.`,
    `Grootste droom: ${entry.dream}.`,
    `Grappige gewoonte: ${entry.funnyHabit}.`,
    `Typische uitspraak: ${entry.motto}`,
  ].join(" ");

  return (
    <section className={`friends-book-page friends-book-${entry.color}`}>
      <div className="friends-book-binding" aria-hidden="true" />

      <div className="friends-book-left">
        <p className="friends-book-kicker">
          <Sparkles size={16} />
          Mijn vriendenpagina
        </p>
        <div className="friends-book-portrait" aria-hidden="true">
          {entry.emoji}
        </div>
        <h2>{entry.name}</h2>
        <p className="friends-book-discoverer">
          Ontdekt door <strong>{entry.discoveredBy}</strong>
        </p>
        <ReadAloudButton text={readableText} />
      </div>

      <div className="friends-book-right">
        <FriendBookAnswer label="Hier woon ik" answer={entry.livesAt} />
        <FriendBookAnswer label="Hier hou ik van" answer={entry.loves} />
        <FriendBookAnswer label="Mijn bijzondere talent" answer={entry.talent} />
        <FriendBookAnswer label="Mijn grootste droom" answer={entry.dream} />
        <FriendBookAnswer label="Mijn grappige gewoonte" answer={entry.funnyHabit} />

        <blockquote>
          <Heart size={18} fill="currentColor" />
          “{entry.motto}”
        </blockquote>
      </div>

      <div className="friends-book-controls">
        <button type="button" onClick={() => turnPage(-1)} aria-label="Vorige bewoner">
          <ChevronLeft />
        </button>
        <span>
          {currentIndex + 1} van {friendBookEntries.length}
        </span>
        <button type="button" onClick={() => turnPage(1)} aria-label="Volgende bewoner">
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function FriendBookAnswer({
  label,
  answer,
}: {
  label: string;
  answer: string;
}) {
  return (
    <div className="friends-book-answer">
      <span>{label}</span>
      <p>{answer}</p>
    </div>
  );
}
