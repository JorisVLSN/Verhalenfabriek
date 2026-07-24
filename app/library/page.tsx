"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { children } from "@/lib/children";

interface Story {
  id: string;
  title: string;
  emoji: string;
  date: string;
  childId: string;
  preview: string;
}

const demoStories: Story[] = [
  { id: "1", title: "De Draak die Bang was voor Hoogtes", emoji: "🐉", date: "2 dagen geleden", childId: "mila", preview: "Een dappere draak ontdekte dat hoogtes niet eng zijn als je vrienden hebt..." },
  { id: "2", title: "Messi en de Magische Voetbal", emoji: "⚽", date: "4 dagen geleden", childId: "ellie", preview: "Messi vond een voetbal die kon praten en samen redde ze het stadion..." },
  { id: "3", title: "Beer Bram Zoekt Zijn Brul", emoji: "🐻", date: "1 week geleden", childId: "mats", preview: "Beer Bram was zijn brul kwijtgeraakt, maar vond hem in de meest onverwachte plek..." },
  { id: "4", title: "De Eenhoorn met de Glinsterende Hoorn", emoji: "🦄", date: "1 week geleden", childId: "mila", preview: "Een eenhoorn leerde dat echte magie in je hart zit, niet in je hoorn..." },
  { id: "5", title: "De Ruimteraket naar de Kaasplaneet", emoji: "🚀", date: "2 weken geleden", childId: "mila", preview: "Een raketreis naar een planeet gemaakt van kaas, waar de maan kaasfondue serveerde..." },
  { id: "6", title: "Poes Minoes Redt de Dag", emoji: "🐱", date: "2 weken geleden", childId: "ellie", preview: "Poes Minoes ontdekte dat ze kon vliegen en redde een nestje vogels..." },
];

function LibraryContent() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");
  const child = children.find((candidate) => candidate.id === childId);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const visibleStories = child
    ? demoStories.filter((story) => story.childId === child.id)
    : demoStories;

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
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
          <h1 className="text-3xl font-black text-purple-700">📚 Bibliotheek</h1>
          <div className="w-20" /> {/* Spacer */}
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
        >
          <p className="text-purple-500 mb-6 font-semibold">
            {child
              ? `Alle avonturen die ${child.name} met Professor Pluis heeft beleefd.`
              : "Alle avonturen die je hebt beleefd met Professor Pluis."}
          </p>

          {selectedStory ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-100"
            >
              <div className="text-6xl mb-4 text-center">{selectedStory.emoji}</div>
              <h2 className="text-2xl font-black text-purple-700 text-center mb-2">
                {selectedStory.title}
              </h2>
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{selectedStory.date}</span>
              </div>
              <p className="text-purple-600 leading-relaxed text-center max-w-lg mx-auto">
                {selectedStory.preview}
              </p>
              <div className="mt-8 text-center">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-6 py-3 bg-white border-2 border-purple-200 rounded-xl text-purple-600 font-bold hover:bg-purple-50 transition-colors"
                >
                  ← Terug naar bibliotheek
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {visibleStories.map((story, index) => (
                <motion.button
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStory(story)}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-4xl mb-3 text-center">{story.emoji}</div>
                  <h3 className="font-bold text-purple-700 text-sm leading-tight mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-1 text-purple-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{story.date}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
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
