# 📖 Verhalenfabriek

> Waar jij de held bent. Een magische verhalen-app voor kinderen, gebouwd met Next.js 15, Tailwind CSS en Google Gemini AI (gratis!).

## ✨ Features

- **🧒 Multi-kind profielen** — Elk kind heeft eigen verhalen, voorkeuren en voortgang
- **🦉 Professor Pluis** — Een warme, magische gids die samen met het kind verhalen bouwt
- **📖 7-fasen verhaalstructuur** — Intro → Probleem → Ontdekking → Keuze → Nieuw Probleem → Oplossing → Einde
- **⭐ Vonkjes Fantasie** — Beloningssysteem gebaseerd op creativiteit, niet op "goed/fout"
- **🎨 Magische illustraties** — AI-gegenereerde afbeeldingen via Google Imagen (gratis)
- **📚 Verhalenbibliotheek** — Bewaar en herlees alle avonturen
- **🏆 Avonturen overzicht** — Persoonlijke statistieken per kind
- **👨 Papa-modus** — PIN-beveiligd dashboard met overzicht van alle kinderen

## 🚀 Tech Stack

| Technologie | Versie | Doel |
|------------|--------|------|
| Next.js | 15.1 | Framework |
| React | 19.0 | UI library |
| TypeScript | 5.7 | Type safety |
| Tailwind CSS | 4.0 | Styling |
| Google Gemini | 2.5 Flash | AI verhalen (gratis!) |
| Google Imagen | 4.0 | AI illustraties (gratis!) |
| Framer Motion | 11.0 | Animaties |
| Lucide React | 0.46 | Iconen |

## 🆓 Gratis AI = Geen maandelijkse kosten!

Deze app gebruikt **Google Gemini 2.5 Flash** en **Imagen 4.0** via de gratis tier:
- ✅ **250 requests/dag** voor tekst (meer dan genoeg!)
- ✅ **Gratis afbeeldingen** genereren
- ✅ Geen creditcard nodig
- ✅ Data blijft veilig (geen training op je data)

## 📦 Installatie

### Stap 1: Project klonen
```bash
git clone https://github.com/jouw-username/verhalenfabriek.git
cd verhalenfabriek
```

### Stap 2: Dependencies installeren
```bash
npm install
```

### Stap 3: Google API Key ophalen (gratis!)
1. Ga naar [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Log in met je Google account
3. Klik op "Create API Key"
4. Kopieer de key

### Stap 4: Environment variables instellen
```bash
cp .env.local.example .env.local
```

Open `.env.local` en vul je API key in:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

### Stap 5: Development server starten
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🚀 Deploy naar Vercel

### Stap 1: Push naar GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/jouw-username/verhalenfabriek.git
git push -u origin main
```

### Stap 2: Importeer in Vercel
1. Ga naar [vercel.com](https://vercel.com)
2. Klik "Add New Project"
3. Importeer je GitHub repo
4. Voeg `GOOGLE_API_KEY` toe bij Environment Variables
5. Klik "Deploy"

## 🏗️ Projectstructuur

```
verhalenfabriek/
├── app/
│   ├── api/
│   │   ├── story/route.ts      # Gemini AI streaming API
│   │   └── image/route.ts      # Imagen afbeeldingen API
│   ├── story/page.tsx          # Verhalenfabriek interface
│   ├── library/page.tsx        # Verhalenbibliotheek
│   ├── dashboard/page.tsx      # Papa-modus dashboard
│   ├── page.tsx                # Home met profielkeuze
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Globale styles
├── lib/
│   ├── children.ts             # Kinderprofielen data
│   ├── professor-pluis.ts      # Prompt engineering
│   └── gemini.ts               # Gemini configuratie
├── components/                 # Herbruikbare componenten
├── public/                     # Statische bestanden
├── .env.local                  # Environment variables
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Aanpassen

### Kinderprofielen wijzigen
Bewerk `lib/children.ts`:
```typescript
export const children = [
  {
    id: "jouw-kind",
    name: "Naam",
    age: 6,
    avatar: "👧",
    style: "korte zinnen, veel keuzes",
    themes: ["dinosaurussen", "ruimte"],
    // ...
  }
];
```

### PIN wijzigen
Bewerk `app/dashboard/page.tsx`:
```typescript
const PARENT_PIN = "jouw-nieuwe-pin";
```

### AI gedrag aanpassen
Bewerk `lib/professor-pluis.ts`:
```typescript
export function professorPluisSystemPrompt(childName, age, style) {
  return `Je bent Professor Pluis... [pas aan naar wens]`;
}
```

## 📊 Gratis tier limieten (Google AI)

| Service | Gratis limiet | Wat betekent dat? |
|---------|--------------|-------------------|
| Gemini 2.5 Flash | 250 req/dag | ~250 verhalen per dag |
| Imagen 4.0 | 250 req/dag | ~250 illustraties per dag |
| Context window | 1M tokens | Zeer lange verhalen mogelijk |

> 💡 **Tip**: Met 250 verhalen per dag kun je maandenlang gratis gebruiken!

## 🔮 Toekomstige uitbreidingen

- [ ] **Supabase database** — Echte opslag van verhalen en voortgang
- [ ] **Authenticatie** — Ouder-login met email/wachtwoord
- [ ] **Spraak** — Text-to-speech voor voorleesmodus
- [ ] **Meer locaties** — Het Bos, De Bibliotheek, Het Kasteel, etc.
- [ ] **Delen** — Verhalen delen met familie
- [ ] **Offline mode** — Werkt zonder internet

## 📝 Licentie

MIT License — Gebruik het vrijelijk voor je eigen gezin of project!

## 💜 Credits

Gemaakt met liefde voor Mila, Ellie en Mats. Professor Pluis is altijd trots op je.

---

**Veel leesplezier!** 📖✨
