export interface StoredStoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StoredStory {
  id: string;
  childId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredStoryMessage[];
  currentPhase?: number;
  residentId?: string;
  source?: "created" | "courtyard-daily";
  dailyDateKey?: string;
  dailySignature?: string;
}

const STORAGE_KEY = "verhalenfabriek:stories:v1";

export function getStoredStories(): StoredStory[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];

    const stories = JSON.parse(value);
    return Array.isArray(stories) ? stories : [];
  } catch {
    return [];
  }
}

export function saveStoredStory(story: StoredStory) {
  const stories = getStoredStories();
  const existingIndex = stories.findIndex((item) => item.id === story.id);

  if (existingIndex >= 0) {
    stories[existingIndex] = story;
  } else {
    stories.unshift(story);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  void syncStoryToDatabase(story);
}

export function deleteStoredStory(storyId: string, childId: string) {
  const stories = getStoredStories();
  const remainingStories = stories.filter(
    (story) => !(story.id === storyId && story.childId === childId)
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingStories));
  void fetch(
    `/api/stories?id=${encodeURIComponent(storyId)}&childId=${encodeURIComponent(
      childId
    )}`,
    { method: "DELETE" }
  ).catch(() => undefined);
  return remainingStories;
}

export async function getAvailableStories(childId: string) {
  const localStories = getStoredStories();

  try {
    const response = await fetch(
      `/api/stories?childId=${encodeURIComponent(childId)}`,
      { cache: "no-store" }
    );
    if (!response.ok) return localStories;

    const data = (await response.json()) as {
      configured?: boolean;
      stories?: StoredStory[];
    };
    if (!data.configured || !Array.isArray(data.stories)) return localStories;

    const merged = new Map<string, StoredStory>();
    [...data.stories, ...localStories].forEach((story) => {
      const previous = merged.get(story.id);
      if (
        !previous ||
        new Date(story.updatedAt).getTime() >
          new Date(previous.updatedAt).getTime()
      ) {
        merged.set(story.id, story);
      }
    });
    const stories = Array.from(merged.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));

    localStories
      .filter((story) => story.childId === childId)
      .forEach((story) => void syncStoryToDatabase(story));

    return stories;
  } catch {
    return localStories;
  }
}

async function syncStoryToDatabase(story: StoredStory) {
  try {
    await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story),
    });
  } catch {
    // De lokale boekenplank blijft beschikbaar wanneer er geen verbinding is.
  }
}

export function createStoryTitle(
  childName: string,
  messages: StoredStoryMessage[]
) {
  const firstIdea = messages.find(
    (message) => message.role === "user" && message.content.trim()
  )?.content.trim();

  if (!firstIdea) return `Een nieuw avontuur van ${childName}`;

  const shortIdea =
    firstIdea.length > 42 ? `${firstIdea.slice(0, 39).trim()}…` : firstIdea;

  return `${childName} en ${shortIdea}`;
}
