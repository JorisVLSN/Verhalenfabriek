import Link from "next/link";
import { BookOpen, Lightbulb, MessageCircle, ShieldAlert } from "lucide-react";
import { children } from "@/lib/children";
import { databaseRequest, isDatabaseConfigured } from "@/lib/database";
import { residentCanon, ResidentId } from "@/lib/resident-canon";

export const dynamic = "force-dynamic";

interface StoryCountRow {
  child_id: string;
}

interface InteractionRow {
  child_id: string;
  resident_id: ResidentId;
}

interface SuggestionRow {
  id: string;
  child_id: string;
  suggested_name: string;
  species: string | null;
  likes: string[];
  traits: string[];
  evidence: string;
  status: string;
  created_at: string;
}

export default async function PluisKantoorPage() {
  const configured = isDatabaseConfigured();
  let stories: StoryCountRow[] = [];
  let interactions: InteractionRow[] = [];
  let suggestions: SuggestionRow[] = [];
  let databaseError = "";

  if (configured) {
    try {
      [stories, interactions, suggestions] = await Promise.all([
        databaseRequest<StoryCountRow[]>("stories?select=child_id"),
        databaseRequest<InteractionRow[]>(
          "interactions?select=child_id,resident_id"
        ),
        databaseRequest<SuggestionRow[]>(
          "character_suggestions?select=*&order=created_at.desc"
        ),
      ]);
    } catch (error) {
      console.error("Pluis kantoor database error:", error);
      databaseError =
        "Het kantoor vindt de database, maar kan de boekenkasten nog niet openen. Controleer of het databaseschema volledig is uitgevoerd en of de Supabase-sleutels juist zijn ingevuld.";
    }
  }

  return (
    <main className="admin-office">
      <nav>
        <Link href="/">← Terug naar de Verhalenfabriek</Link>
      </nav>

      <header>
        <p>Verborgen bladzijde</p>
        <h1>Het kantoor van Professor Pluis</h1>
        <span>Een rustig overzicht voor de volwassen verhalenbewaker.</span>
      </header>

      <aside>
        <ShieldAlert />
        <p>
          Deze pagina heeft nog geen aanmelding. Wie het adres kent, kan dit
          overzicht bekijken. Voeg vóór een ruimere test een ouderlogin toe.
        </p>
      </aside>

      {!configured || databaseError ? (
        <section className="admin-empty">
          <h2>
            {databaseError
              ? "Professor Pluis krijgt de boekenkast nog niet open"
              : "De database wacht nog op haar sleutel"}
          </h2>
          <p>
            {databaseError ||
              "Voer eerst het Supabase-schema uit en voeg de twee geheime omgevingsvariabelen toe aan Vercel."}
          </p>
          <ol className="admin-setup-list">
            <li>Open in Supabase de SQL Editor.</li>
            <li>
              Voer de volledige inhoud van <code>supabase/schema.sql</code> uit.
            </li>
            <li>
              Controleer in Vercel <code>SUPABASE_URL</code> en{" "}
              <code>SUPABASE_SECRET_KEY</code>.
            </li>
            <li>Start daarna een nieuwe deployment.</li>
          </ol>
        </section>
      ) : (
        <>
          <section className="admin-stats" aria-labelledby="activity-title">
            <div className="admin-section-title">
              <p>Wat gebeurt er in de fabriek?</p>
              <h2 id="activity-title">Activiteit per ontdekker</h2>
            </div>
            <div className="admin-child-grid">
              {children.map((child) => {
                const childStories = stories.filter(
                  (story) => story.child_id === child.id
                ).length;
                const childInteractions = interactions.filter(
                  (interaction) => interaction.child_id === child.id
                );
                const residentCounts = childInteractions.reduce<
                  Record<string, number>
                >((counts, interaction) => {
                  counts[interaction.resident_id] =
                    (counts[interaction.resident_id] ?? 0) + 1;
                  return counts;
                }, {});

                return (
                  <article key={child.id}>
                    <h3>{child.name}</h3>
                    <div>
                      <span>
                        <BookOpen /> {childStories} verhalen
                      </span>
                      <span>
                        <MessageCircle /> {childInteractions.length} gesprekken
                      </span>
                    </div>
                    <ul>
                      {Object.entries(residentCounts).length ? (
                        Object.entries(residentCounts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([residentId, count]) => (
                            <li key={residentId}>
                              {residentCanon[residentId as ResidentId]?.name ??
                                residentId}
                              <strong>{count}</strong>
                            </li>
                          ))
                      ) : (
                        <li>Nog geen bewoners gesproken.</li>
                      )}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="admin-suggestions" aria-labelledby="suggestions-title">
            <div className="admin-section-title">
              <p>Zaadjes uit nieuwe verhalen</p>
              <h2 id="suggestions-title">Mogelijke nieuwe personages</h2>
            </div>
            {suggestions.length ? (
              <div className="admin-suggestion-list">
                {suggestions.map((suggestion) => {
                  const child =
                    children.find(
                      (candidate) => candidate.id === suggestion.child_id
                    )?.name ?? suggestion.child_id;
                  return (
                    <article key={suggestion.id}>
                      <Lightbulb />
                      <div>
                        <p>
                          <strong>{child}</strong> heeft mogelijk{" "}
                          <strong>{suggestion.suggested_name}</strong> ontdekt
                          {suggestion.species
                            ? `, een ${suggestion.species}`
                            : ""}
                          .
                        </p>
                        {suggestion.likes?.length > 0 && (
                          <p>Houdt van: {suggestion.likes.join(", ")}.</p>
                        )}
                        {suggestion.traits?.length > 0 && (
                          <p>Eigenschappen: {suggestion.traits.join(", ")}.</p>
                        )}
                        <small>{suggestion.evidence}</small>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="admin-empty">
                Nog geen nieuw personage ontdekt in een voltooid verhaal.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
