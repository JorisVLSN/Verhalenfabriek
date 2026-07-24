export interface Resident {
  id: string;
  name: string;
  emoji: string;
  shortDescription: string;
  storyRole: string;
}

export const residents: Resident[] = [
  {
    id: "driekoppig",
    name: "Driekoppig",
    emoji: "🐱",
    shortDescription: "Drie slimme hoofden die altijd samenwerken.",
    storyRole:
      "Driekoppig is een witte driekoppige poes met regenboogvlekken. De hoofden heten Zonnestraal, Donderwolk en Speurpoes. Ze zijn het altijd met elkaar eens en helpen door samen te kijken, denken en speuren.",
  },
  {
    id: "pluiziebol",
    name: "Pluiziebol",
    emoji: "🐈",
    shortDescription: "Een warme vriend die goed naar iedereen luistert.",
    storyRole:
      "Pluiziebol is een lieve, pluizige kater. Hij brengt rust en vriendschap in het avontuur, luistert aandachtig en helpt andere personages zich welkom te voelen.",
  },
  {
    id: "dokter-pen",
    name: "Dokter Pen",
    emoji: "🐭",
    shortDescription: "Een kleine dokter voor kapotte boeken en ideeën.",
    storyRole:
      "Dokter Pen is een behulpzame muis die kapotte boeken, verdwaalde woorden en mislukte ideeën helpt herstellen. Hij laat zien dat fouten gerepareerd mogen worden.",
  },
  {
    id: "juffrouw-andersom",
    name: "Juffrouw Andersom",
    emoji: "🐰",
    shortDescription: "Een deftig konijn dat soms het omgekeerde zegt.",
    storyRole:
      "Juffrouw Andersom is een keurig en vriendelijk konijn. Ze zegt soms per ongeluk precies het tegenovergestelde van wat ze bedoelt. Dat zorgt voor veilige taalgrapjes en laat het kind tegenstellingen ontdekken.",
  },
  {
    id: "karel-kraa",
    name: "Karel Kraa",
    emoji: "🐦‍⬛",
    shortDescription: "Een enthousiaste kraai met reusachtige verhalen.",
    storyRole:
      "Karel Kraa is een enthousiaste kraai die graag sterk overdrijft. Hij liegt nooit om iemand pijn te doen. Zijn wilde verhalen geven ruimte aan fantasie en nodigen het kind uit om nieuwsgierige vragen te stellen.",
  },
];

export function getResident(residentId?: string | null) {
  return residents.find((resident) => resident.id === residentId);
}
