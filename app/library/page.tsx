"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, Sparkles } from "lucide-react";
import { children } from "@/lib/children";
import { getStoredStories, StoredStory } from "@/lib/story-storage";

function formatStoryDate(value: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function LibraryContent() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");
  const child = children.find((candidate) => candidate.id === childId);
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);

  useEffect(() => {
    const allStories = getStoredStories();
    setStories(
      child
        ? allStories.filter((story) => story.childId === child.id)
        : allStories
    );
  }, [child]);

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
                  <motion.button
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedStory(story)}
                    className="rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 p-5 text-left transition-all hover:border-purple-300 hover:shadow-lg"
                  >
                    <BookOpen className="mb-4 h-9 w-9 text-purple-500" />
                    <h2 className="mb-3 font-black leading-snug text-purple-700">
                      {story.title}
                    </h2>
                    <p className="flex items-center gap-1 text-xs text-purple-400">
                      <Calendar className="h-3 w-3" />
                      {formatStoryDate(story.updatedAt)}
                    </p>
                  </motion.button>
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
