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
}

export function deleteStoredStory(storyId: string, childId: string) {
  const stories = getStoredStories();
  const remainingStories = stories.filter(
    (story) => !(story.id === storyId && story.childId === childId)
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingStories));
  return remainingStories;
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
