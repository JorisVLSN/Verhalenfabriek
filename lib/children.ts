export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  style: string;
  themes: string[];
  readingLevel: string;
  sparkles: number;
  storiesCompleted: number;
  favoriteCharacter: string;
  preferences: Record<string, number>;
}

export const children: Child[] = [
  {
    id: "mila",
    name: "Mila",
    age: 9,
    avatar: "👧",
    style: "langere verhalen, meer keuzes, mag zelf typen",
    themes: ["draken", "ruimte", "eenhoorns"],
    readingLevel: "meer lezen/schrijven",
    sparkles: 47,
    storiesCompleted: 12,
    favoriteCharacter: "Draak Draakje",
    preferences: { dragons: 5, space: 3, unicorns: 4 }
  },
  {
    id: "ellie",
    name: "Ellie",
    age: 7,
    avatar: "👧",
    style: "kortere zinnen, voetbal, Messi, veel keuze-knoppen",
    themes: ["voetbal", "avontuur", "dieren"],
    readingLevel: "kortere zinnen",
    sparkles: 32,
    storiesCompleted: 8,
    favoriteCharacter: "Poes Minoes",
    preferences: { football: 4, adventure: 3, animals: 2 }
  },
  {
    id: "pauline",
    name: "Pauline",
    age: 8,
    avatar: "P",
    style: "rustig tempo, korte stukjes, eenvoudige woorden en veel visuele steun",
    themes: ["dieren", "fantasie", "vriendschap"],
    readingLevel: "rustig en leesvriendelijk",
    sparkles: 0,
    storiesCompleted: 0,
    favoriteCharacter: "Professor Pluis",
    preferences: { animals: 4, fantasy: 4, friendship: 5 }
  },
  {
    id: "mats",
    name: "Mats",
    age: 4,
    avatar: "👦",
    style: "voorleesmodus, simpele woorden, veel fantasie en dieren",
    themes: ["dieren", "auto's", "muziek"],
    readingLevel: "voorleesmodus",
    sparkles: 23,
    storiesCompleted: 5,
    favoriteCharacter: "Beer Bram",
    preferences: { animals: 5, cars: 3, music: 2 }
  }
];
