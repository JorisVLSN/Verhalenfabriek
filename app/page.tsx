import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { ProfessorPluisPortrait } from "@/components/professor-pluis-portrait";

export default function Home() {
  return (
    <main className="storybook-home">
      <div className="storybook-glow storybook-glow-left" aria-hidden="true" />
      <div className="storybook-glow storybook-glow-right" aria-hidden="true" />

      <header className="storybook-brand" aria-label="Verhalenfabriek">
        <span className="storybook-brand-mark" aria-hidden="true">
          <BookOpen size={24} strokeWidth={2.2} />
        </span>
        <span>Verhalenfabriek</span>
      </header>

      <section className="storybook-hero">
        <div className="storybook-copy">
          <p className="storybook-eyebrow">
            <Sparkles size={17} aria-hidden="true" />
            Eerste Droom
          </p>

          <h1>Ik heb stiekem al op je gewacht.</h1>

          <p className="storybook-intro">
            Kom maar binnen. Er ligt een leeg verhaal klaar en volgens mij
            mist het nog precies één ding: <strong>jouw fantasie.</strong>
          </p>

          <div className="storybook-actions">
            <Link className="storybook-button storybook-button-primary" href="/ontdekker?next=story">
              <Sparkles size={21} aria-hidden="true" />
              Samen een verhaal maken
            </Link>
            <Link className="storybook-button storybook-button-secondary" href="/ontdekker?next=library">
              <BookOpen size={21} aria-hidden="true" />
              Mijn verhalen
            </Link>
          </div>

          <p className="storybook-signature">Professor Pluis</p>
        </div>

        <div className="storybook-scene" aria-label="Professor Pluis leest in haar gezellige leeshoek">
          <span className="storybook-star storybook-star-one" aria-hidden="true">✦</span>
          <span className="storybook-star storybook-star-two" aria-hidden="true">✧</span>
          <span className="storybook-butterfly" aria-hidden="true">⌁</span>
          <ProfessorPluisPortrait />
          <p className="storybook-caption">Er is altijd plaats voor nog één verhaal.</p>
        </div>
      </section>

      <footer className="storybook-footer">
        Een rustige plek voor grote en kleine verhalenmakers
      </footer>
    </main>
  );
}
