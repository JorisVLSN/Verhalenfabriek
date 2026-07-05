"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { children, Child } from "@/lib/children";
import { Sparkles, BookOpen, Trophy, Settings } from "lucide-react";

export default function Home() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 relative"
        >
          <div className="absolute top-2 right-4 text-2xl animate-sparkle">
            ✨🌟✨
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-shimmer">
            📖 Verhalenfabriek
          </h1>
          <p className="mt-2 text-lg text-purple-600 font-semibold">
            {selectedChild ? `Klaar voor avontuur, ${selectedChild.name}?` : "Waar jij de held bent"}
          </p>
        </motion.div>

        {/* Navigatie */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow-lg shadow-purple-200"
          >
            🏠 Home
          </Link>
          <Link
            href="/story"
            className="px-5 py-2.5 rounded-xl bg-white border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
          >
            🏭 Verhalenfabriek
          </Link>
          <Link
            href="/library"
            className="px-5 py-2.5 rounded-xl bg-white border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
          >
            📚 Bibliotheek
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
          >
            👨 Papa-modus
          </Link>
        </motion.nav>

        {/* Kinderprofielen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
        >
          <h2 className="text-xl font-bold text-purple-700 mb-6 flex items-center gap-2">
            👋 Kies wie vandaag op avontuur gaat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children.map((child, index) => (
              <motion.button
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => setSelectedChild(child)}
                className={`relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border-3 ${
                  selectedChild?.id === child.id
                    ? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-500 shadow-lg shadow-purple-200"
                    : "bg-gradient-to-br from-white to-purple-50 border-transparent hover:border-purple-300 hover:shadow-lg"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-radial from-purple-100/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <span className="text-5xl block mb-3 animate-float">
                  {child.avatar}
                </span>
                <div className="text-2xl font-black text-purple-700">
                  {child.name}
                </div>
                <div className="text-sm text-purple-500 font-semibold mt-1">
                  {child.age} jaar
                </div>
                <div className="text-xs text-purple-400 mt-2 italic">
                  {child.style}
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {child.themes.map((theme) => (
                    <span
                      key={theme}
                      className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Geselecteerd kind kaart */}
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
          >
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              🌟 Welkom terug, {selectedChild.name}!
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 text-center border-2 border-yellow-200">
                <Sparkles className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                <div className="text-2xl font-black text-orange-600">
                  {selectedChild.sparkles}
                </div>
                <div className="text-xs text-orange-500 font-semibold">
                  Vonkjes
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center border-2 border-purple-200">
                <BookOpen className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                <div className="text-2xl font-black text-purple-600">
                  {selectedChild.storiesCompleted}
                </div>
                <div className="text-xs text-purple-500 font-semibold">
                  Verhalen
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 text-center border-2 border-blue-200">
                <Trophy className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <div className="text-lg font-bold text-blue-600 truncate">
                  {selectedChild.favoriteCharacter}
                </div>
                <div className="text-xs text-blue-500 font-semibold">
                  Favoriet
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-4 text-center border-2 border-green-200">
                <Settings className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <div className="text-sm font-bold text-green-600">
                  {selectedChild.readingLevel}
                </div>
                <div className="text-xs text-green-500 font-semibold">
                  Niveau
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/story?child=${selectedChild.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-transform animate-pulse-glow"
              >
                ✨ Begin een nieuw avontuur
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
