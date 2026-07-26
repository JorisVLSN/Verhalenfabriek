"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2, Printer } from "lucide-react";
import { children } from "@/lib/children";
import { getAvailableStories, StoredStory } from "@/lib/story-storage";

interface PrintStoryProps {
  storyId: string;
  childId: string;
}

export function PrintStory({ storyId, childId }: PrintStoryProps) {
  const [story, setStory] = useState<StoredStory | null>(null);
  const [loaded, setLoaded] = useState(false);
  const child = children.find((candidate) => candidate.id === childId);

  useEffect(() => {
    void getAvailableStories(childId).then((stories) => {
      setStory(stories.find((candidate) => candidate.id === storyId) ?? null);
      setLoaded(true);
    });
  }, [childId, storyId]);

  if (!loaded) {
    return (
      <main className="print-story-loading">
        <Loader2 className="animate-spin" />
        Professor Pluis zoekt het boek…
      </main>
    );
  }

  if (!story || !child) {
    return (
      <main className="print-story-loading">
        Dit boek kon niet worden gevonden.
      </main>
    );
  }

  const storyParagraphs = story.messages
    .filter((message) => message.role === "assistant")
    .flatMap((message) =>
      message.content
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    );

  return (
    <main className="print-book">
      <div className="print-book-toolbar">
        <button type="button" onClick={() => window.print()}>
          <Printer size={18} />
          Afdrukken of bewaren als PDF
        </button>
        <p>Kies in het afdrukvenster voor “Opslaan als PDF”.</p>
      </div>

      <article>
        <header className="print-book-cover">
          <BookOpen aria-hidden="true" />
          <p>Een boek uit de Verhalenfabriek</p>
          <h1>{story.title}</h1>
          <span>Bedacht door {child.name}</span>
          <small>
            Samen met Professor Pluis ·{" "}
            {new Intl.DateTimeFormat("nl-BE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(story.createdAt))}
          </small>
        </header>

        <section className="print-book-story">
          {storyParagraphs.map((paragraph, index) => (
            <div className="print-book-page" key={`${index}-${paragraph.slice(0, 20)}`}>
              <p>{paragraph}</p>
              <span>{index + 1}</span>
            </div>
          ))}
        </section>

        <footer className="print-book-ending">
          <p>Einde</p>
          <strong>Dit verhaal groeide uit de fantasie van {child.name}.</strong>
          <span>Verhalenfabriek · Waar ieder kind de held is</span>
        </footer>
      </article>
    </main>
  );
}
