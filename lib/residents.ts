import {
  getResidentCanon,
  residentCanon,
  ResidentId,
} from "@/lib/resident-canon";

export interface Resident {
  id: ResidentId;
  name: string;
  emoji: string;
  imageSrc?: string;
  shortDescription: string;
  storyRole: string;
}

const courtyardResidentIds: ResidentId[] = [
  "driekoppig",
  "pluiziebol",
  "dokter-pen",
  "juffrouw-andersom",
  "karel-kraa",
  "snuffel",
];

export const residents: Resident[] = courtyardResidentIds.map((id) => {
  const canon = residentCanon[id];

  return {
    id,
    name: canon.name,
    emoji: canon.emoji,
    imageSrc: canon.imageSrc,
    shortDescription: canon.essence,
    storyRole: [
      canon.kind,
      canon.role,
      canon.essence,
      `Vaste feiten: ${canon.fixedFacts.join(" ")}`,
      `Spreekstijl: ${canon.speechStyle.join(" ")}`,
      `Doet nooit: ${canon.neverDoes.join("; ")}.`,
    ].join("\n"),
  };
});

export function getResident(residentId?: string | null) {
  if (!getResidentCanon(residentId)) return undefined;
  return residents.find((resident) => resident.id === residentId);
}
