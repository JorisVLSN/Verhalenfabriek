"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { children } from "@/lib/children";
import {
  deleteStoredStory,
  getStoredStories,
  StoredStory,
} from "@/lib/story-storage";

function formatStoryDate(value: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get("child");
  const child = children.find((candidate) => candidate.id === childId);
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);
  const [storyPendingDelete, setStoryPendingDelete] =
    useState<StoredStory | null>(null);

  useEffect(() => {
    if (!child) {
      router.replace("/ontdekker?next=library");
      return;
    }

    const allStories = getStoredStories();
    setStories(allStories.filter((story) => story.childId === child.id));
  }, [child, router]);

  const confirmDelete = () => {
    if (!storyPendingDelete || !child) return;

    const remainingStories = deleteStoredStory(
      storyPendingDelete.id,
      child.id
    ).filter((story) => story.childId === child.id);

    setStories(remainingStories);
    if (selectedStory?.id === storyPendingDelete.id) {
      setSelectedStory(null);
    }
    setStoryPendingDelete(null);
  };

  if (!child) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-black text-purple-700">
              Mijn verhalen
            </h1>
            {child && (
              <p className="mt-1 text-sm font-bold text-purple-400">
                De boekenplank van {child.name}
              </p>
            )}
          </div>
          <div className="w-20" />
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
        >
          {selectedStory ? (
            <article className="rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8">
              <button
                onClick={() => setSelectedStory(null)}
                className="mb-6 font-bold text-purple-500"
              >
                ← Terug naar de boekenplank
              </button>

              <div className="mb-3 flex justify-center">
                <BookOpen className="h-12 w-12 text-purple-500" />
              </div>
              <h2 className="text-center text-2xl font-black text-purple-700">
                {selectedStory.title}
              </h2>
              <p className="mb-8 mt-2 text-center text-sm text-purple-400">
                {formatStoryDate(selectedStory.createdAt)}
              </p>

              <div className="mb-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => setStoryPendingDelete(selectedStory)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 py-2 text-sm font-black text-rose-500 transition-colors hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Verhaal wissen
                </button>
              </div>

              <div className="mx-auto max-w-2xl space-y-5">
                {selectedStory.messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "assistant"
                        ? "rounded-2xl bg-white p-5 leading-relaxed text-purple-700"
                        : "ml-auto max-w-[85%] rounded-2xl bg-purple-600 p-4 text-white"
                    }
                  >
                    {message.role === "assistant" && (
                      <p className="mb-1 text-xs font-black text-purple-400">
                        Professor Pluis
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : stories.length > 0 ? (
            <>
              <p className="mb-6 font-semibold text-purple-500">
                Professor Pluis heeft deze avonturen zorgvuldig bewaard.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {stories.map((story, index) => (
                  <motion.article
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -4 }}
                    className="relative rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 transition-all hover:border-purple-300 hover:shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedStory(story)}
                      className="block w-full p-5 pb-16 text-left"
                    >
                      <BookOpen className="mb-4 h-9 w-9 text-purple-500" />
                      <h2 className="mb-3 font-black leading-snug text-purple-700">
                        {story.title}
                      </h2>
                      <p className="flex items-center gap-1 text-xs text-purple-400">
                        <Calendar className="h-3 w-3" />
                        {formatStoryDate(story.updatedAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoryPendingDelete(story)}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-black text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Wis ${story.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Wissen
                    </button>
                  </motion.article>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <Sparkles className="mx-auto mb-5 h-12 w-12 text-purple-300" />
              <h2 className="text-xl font-black text-purple-700">
                Deze boekenplank wacht nog op haar eerste verhaal.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-purple-400">
                Zodra je een avontuur begint, bewaart Professor Pluis het hier
                automatisch.
              </p>
              <Link
                href={`/story?child=${child?.id ?? "mila"}`}
                className="mt-7 inline-flex rounded-2xl bg-purple-600 px-6 py-3 font-black text-white"
              >
                Begin een verhaal
              </Link>
            </div>
          )}
        </motion.section>

        {storyPendingDelete && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-purple-950/30 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-story-title"
          >
            <div className="relative w-full max-w-md rounded-3xl border-4 border-white bg-gradient-to-br from-white to-rose-50 p-7 text-center shadow-2xl">
              <button
                type="button"
                onClick={() => setStoryPendingDelete(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-purple-300 hover:bg-purple-50 hover:text-purple-600"
                aria-label="Sluiten"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-500">
                <Trash2 className="h-7 w-7" />
              </div>
              <h2
                id="delete-story-title"
                className="text-2xl font-black text-purple-700"
              >
                Dit verhaal echt wissen?
              </h2>
              <p className="mt-3 text-purple-500">
                <strong>{storyPendingDelete.title}</strong> verdwijnt dan uit{" "}
                de boekenplank van {child?.name}. Dit kan niet ongedaan worden
                gemaakt.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStoryPendingDelete(null)}
                  className="rounded-2xl border-2 border-purple-200 bg-white px-5 py-3 font-black text-purple-600"
                >
                  Toch bewaren
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-2xl bg-rose-500 px-5 py-3 font-black text-white shadow-lg shadow-rose-200"
                >
                  Ja, wis het verhaal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <LibraryContent />
    </Suspense>
  );
}
