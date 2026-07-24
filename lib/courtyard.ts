import {
  residentCanon,
  ResidentId,
} from "@/lib/resident-canon";
import { StoredStory } from "@/lib/story-storage";

export interface DailyStoryPlan {
  dateKey: string;
  speakerId: ResidentId;
  subjectId: ResidentId;
  theme: string;
  signature: string;
}

const courtyardResidentIds = Object.keys(residentCanon) as ResidentId[];

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDailyStoryPlan(
  childId: string,
  stories: StoredStory[],
  dateKey = getLocalDateKey()
): DailyStoryPlan {
  const speakerIndex = hashText(dateKey) % courtyardResidentIds.length;
  const speakerId = courtyardResidentIds[speakerIndex];
  const possibleSubjects = courtyardResidentIds.filter((id) => id !== speakerId);
  const themes = residentCanon[speakerId].storyThemes;
  const usedSignatures = new Set(
    stories
      .filter((story) => story.childId === childId && story.dailySignature)
      .map((story) => story.dailySignature)
  );
  const startIndex =
    hashText(`${dateKey}:${childId}`) % (possibleSubjects.length * themes.length);

  for (
    let offset = 0;
    offset < possibleSubjects.length * themes.length;
    offset += 1
  ) {
    const index =
      (startIndex + offset) % (possibleSubjects.length * themes.length);
    const subjectId = possibleSubjects[index % possibleSubjects.length];
    const theme = themes[Math.floor(index / possibleSubjects.length) % themes.length];
    const signature = `${speakerId}:${subjectId}:${theme}`;

    if (!usedSignatures.has(signature)) {
      return { dateKey, speakerId, subjectId, theme, signature };
    }
  }

  const subjectId = possibleSubjects[startIndex % possibleSubjects.length];
  const cycle = usedSignatures.size + 1;
  const theme = `${themes[startIndex % themes.length]} (nieuw avontuur ${cycle})`;

  return {
    dateKey,
    speakerId,
    subjectId,
    theme,
    signature: `${speakerId}:${subjectId}:${theme}`,
  };
}

export function findDailyStory(
  stories: StoredStory[],
  childId: string,
  dateKey = getLocalDateKey()
) {
  return stories.find(
    (story) =>
      story.childId === childId &&
      story.source === "courtyard-daily" &&
      story.dailyDateKey === dateKey
  );
}

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}
