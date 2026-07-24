import { ProfessorPluisAvatar } from "@/components/professor-pluis-portrait";

export function ProfessorGreeting() {
  return (
    <header className="discoverer-greeting">
      <ProfessorPluisAvatar size="large" />
      <p>Ik heb stiekem al op je gewacht.</p>
      <h1 id="discoverer-title">Met wie mag ik vandaag op avontuur?</h1>
    </header>
  );
}
