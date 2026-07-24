import { Sparkles } from "lucide-react";

export const professorQuotes = [
  "Elk verhaal begint met iemand die durft te dromen.",
  "Een klein idee kan uitgroeien tot een groot avontuur.",
  "In de Verhalenfabriek is er altijd plaats voor jouw fantasie.",
  "De mooiste verhalen beginnen vaak met: wat als…",
];

export function QuoteCard({ quote }: { quote?: string }) {
  return (
    <aside className="professor-quote" aria-label="Een gedachte van Professor Pluis">
      <span className="professor-quote-icon" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <div>
        <h2>Professor Pluis zegt</h2>
        <blockquote>“{quote ?? professorQuotes[0]}”</blockquote>
      </div>
    </aside>
  );
}
