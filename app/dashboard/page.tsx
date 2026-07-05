"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { children } from "@/lib/children";
import { ArrowLeft, Sparkles, BookOpen, Trophy, User, Lock, X } from "lucide-react";

const PARENT_PIN = "1234";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPinModal, setShowPinModal] = useState(true);

  const checkPin = () => {
    if (pin === PARENT_PIN) {
      setIsAuthenticated(true);
      setShowPinModal(false);
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") checkPin();
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-black text-purple-700 mb-2">
                    Papa-modus
                  </h2>
                  <p className="text-purple-500 mb-6">
                    Voer de ouder-PIN in om het dashboard te openen.
                  </p>

                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(false);
                    }}
                    onKeyPress={handleKeyPress}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full px-4 py-3 text-2xl text-center tracking-[0.5em] border-3 border-purple-200 rounded-2xl outline-none focus:border-purple-500 text-purple-700 font-black"
                    autoFocus
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 font-bold mt-3 text-sm"
                    >
                      Verkeerde PIN. Probeer opnieuw!
                    </motion.p>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Link
                      href="/"
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors text-center"
                    >
                      Annuleren
                    </Link>
                    <button
                      onClick={checkPin}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
                    >
                      Ontgrendelen
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Content */}
        {isAuthenticated && (
          <>
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
              <h1 className="text-3xl font-black text-purple-700">👨 Papa Dashboard</h1>
              <div className="w-20" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{child.avatar}</span>
                    <div>
                      <h2 className="text-xl font-black text-purple-700">
                        {child.name}
                      </h2>
                      <p className="text-purple-400 text-sm font-semibold">
                        {child.age} jaar
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-purple-50">
                      <span className="flex items-center gap-2 text-purple-400 text-sm">
                        <Sparkles className="w-4 h-4" />
                        Vonkjes
                      </span>
                      <span className="font-black text-purple-700">{child.sparkles}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-50">
                      <span className="flex items-center gap-2 text-purple-400 text-sm">
                        <BookOpen className="w-4 h-4" />
                        Verhalen
                      </span>
                      <span className="font-black text-purple-700">{child.storiesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-50">
                      <span className="flex items-center gap-2 text-purple-400 text-sm">
                        <User className="w-4 h-4" />
                        Niveau
                      </span>
                      <span className="font-bold text-purple-700 text-sm">{child.readingLevel}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="flex items-center gap-2 text-purple-400 text-sm">
                        <Trophy className="w-4 h-4" />
                        Favoriet
                      </span>
                      <span className="font-bold text-purple-700 text-sm">{child.favoriteCharacter}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                      Thema's
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {child.themes.map((theme) => (
                        <span
                          key={theme}
                          className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activiteit overzicht */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50"
            >
              <h2 className="text-xl font-bold text-purple-700 mb-4">
                📊 Activiteit deze week
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day, i) => (
                  <div
                    key={day}
                    className={`min-w-[80px] text-center p-4 rounded-2xl border-2 ${
                      i < 5
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {i < 5 ? ["🐉", "⚽", "🐻", "🚀", "🦄"][i] : "🌙"}
                    </div>
                    <div className="text-sm font-bold text-purple-600">{day}</div>
                    {i < 5 && (
                      <div className="text-xs text-purple-400 mt-1">
                        {[2, 1, 3, 0, 2][i]} verhalen
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
