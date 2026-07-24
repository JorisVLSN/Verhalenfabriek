"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { children } from "@/lib/children";

const profileColors: Record<string, string> = {
  mila: "profile-mila",
  pauline: "profile-pauline",
  ellie: "profile-ellie",
  mats: "profile-mats",
};

function ProfileChooser() {
  const searchParams = useSearchParams();
  const requestedDestination = searchParams.get("next");
  const destination = requestedDestination === "library" ? "library" : "story";
  const isLibrary = destination === "library";

  return (
    <main className="profile-page">
      <div className="profile-page-glow" aria-hidden="true" />

      <Link href="/" className="profile-back">
        <ArrowLeft size={19} aria-hidden="true" />
        Terug naar Professor Pluis
      </Link>

      <section className="profile-panel" aria-labelledby="profile-title">
        <p className="profile-eyebrow">
          {isLibrary ? <BookOpen size={17} /> : <Sparkles size={17} />}
          {isLibrary ? "De boekenplank" : "Een nieuw avontuur"}
        </p>

        <h1 id="profile-title">Wie komt vandaag op bezoek?</h1>
        <p className="profile-intro">
          Professor Pluis heeft voor ieder van jullie een eigen plekje bewaard.
        </p>

        <div className="profile-grid">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/${destination}?child=${child.id}`}
              className={`profile-card ${profileColors[child.id] ?? ""}`}
              aria-label={`${child.name}, ${child.age} jaar`}
            >
              <span className="profile-avatar" aria-hidden="true">
                {child.name.slice(0, 1)}
              </span>
              <span className="profile-name">{child.name}</span>
              <span className="profile-age">{child.age} jaar</span>
              <span className="profile-invitation">
                {isLibrary ? "Open mijn verhalen" : "Ik ga mee"}
              </span>
            </Link>
          ))}
        </div>

        <p className="profile-note">
          Elk avontuur past zich aan aan wie er vandaag binnenstapt.
        </p>
      </section>
    </main>
  );
}

export default function OntdekkerPage() {
  return (
    <Suspense fallback={<main className="profile-page" />}>
      <ProfileChooser />
    </Suspense>
  );
}
