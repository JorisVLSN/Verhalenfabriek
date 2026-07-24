"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { children, Child } from "@/lib/children";
import { storyPhases, StoryPhase } from "@/lib/professor-pluis";
import { Sparkles, Send, ArrowLeft, Loader2 } from "lucide-react";
import { ProfessorPluisAvatar } from "@/components/professor-pluis-portrait";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  phase?: number;
}

function StoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get("child");
  const selectedChild = children.find((c) => c.id === childId);
  const child = selectedChild ?? children[0];

  useEffect(() => {
    if (!selectedChild) {
      router.replace("/ontdekker?next=story");
    }
  }, [selectedChild, router]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sparkles, setSparkles] = useState(child.sparkles);
  const [showChoices, setShowChoices] = useState(false);
  const [illustration, setIllustration] = useState({ emoji: "🏰", text: "De Verhalenfabriek", subtext: "Professor Pluis schudt wat sterrenstof..." });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [storyStarted, setStoryStarted] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addMessage = (role: "user" | "assistant", content: string, phase?: number) => {
    setMessages((prev) => [...prev, { id: generateId(), role, content, phase }]);
  };

  const startAdventure = async () => {
    setStoryStarted(true);
    setCurrentPhase(0);
    setMessages([]);
    setSparkles(child.sparkles);

    // Welkomstbericht van Professor Pluis
    const welcomeMsg = `Ik heb stiekem al op je gewacht, ${child.name}. Er is vannacht iets vreemds gebeurd in de Verhalenfabriek... Er is een verhaal aangekomen zonder held! Wil jij me helpen?`;

    addMessage("assistant", welcomeMsg, 0);
    setIllustration({ emoji: "🏰", text: "De Verhalenfabriek", subtext: "Professor Pluis schudt wat sterrenstof..." });

    // Vraag direct om input
    setTimeout(() => {
      addMessage("assistant", `Hoe ziet jouw held eruit, ${child.name}? Is het een dappere ridder? Een slimme heks? Of misschien iets totaal anders? ✨`, 0);
    }, 500);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    setInput("");
    addMessage("user", messageText);
    setIsLoading(true);
    setShowChoices(false);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: messageText }].map(m => ({
            role: m.role,
            content: m.content
          })),
          childId: child.id,
          phase: currentPhase,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let streamBuffer = "";
      const messageId = generateId();

      // Voeg placeholder toe voor streaming
      setMessages((prev) => [...prev, { id: messageId, role: "assistant", content: "", phase: currentPhase }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          streamBuffer += decoder.decode(value, { stream: true });

          let eventBoundary = streamBuffer.indexOf("\n\n");
          while (eventBoundary !== -1) {
            const event = streamBuffer.slice(0, eventBoundary);
            streamBuffer = streamBuffer.slice(eventBoundary + 2);

            const dataLine = event
              .split("\n")
              .find((line) => line.startsWith("data: "));
            const data = dataLine?.slice(6);

            if (data && data !== "[DONE]") {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text.replace(/\*+/g, "");
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === messageId ? { ...m, content: fullText } : m
                  )
                );
              }
            }

            eventBoundary = streamBuffer.indexOf("\n\n");
          }
        }
      }

      // Update fase en vonkjes
      const newPhase = Math.min(currentPhase + 1, storyPhases.length - 1);
      setCurrentPhase(newPhase);
      setSparkles((prev) => prev + 2);

      // Update illustratie
      const phaseEmojis = ["🌟", "⚡", "🔍", "🤔", "💥", "💡", "🎉"];
      setIllustration({
        emoji: phaseEmojis[newPhase],
        text: `Fase: ${storyPhases[newPhase].name}`,
        subtext: "Professor Pluis schudt wat sterrenstof...",
      });

      // Toon keuzes voor jonge kinderen in de Keuze-fase
      if (child.age <= 7 && newPhase === 3) {
        setShowChoices(true);
      }

      // Einde van het verhaal
      if (newPhase === storyPhases.length - 1) {
        setTimeout(() => {
          setSparkles((prev) => prev + 3);
          setIllustration({
            emoji: "🏆",
            text: "Avontuur Voltooid!",
            subtext: `Je hebt ${sparkles + 5} Vonkjes Fantasie verdiend!`,
          });
        }, 1000);
      }

    } catch (error) {
      console.error("Error:", error);
      addMessage("assistant", "Oeps! Professor Pluis is haar toverstaf even kwijt. Kun je het nog een keer proberen? ✨", currentPhase);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const choiceOptions = [
    { text: "De veilige weg nemen", emoji: "🛡️" },
    { text: "Het avontuurlijke pad", emoji: "⚔️" },
    { text: "Iets totaal anders bedenken", emoji: "✨" },
  ];

  if (!selectedChild) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </Link>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-purple-700">
              📖 Verhalenfabriek
            </h1>
            <p className="text-purple-500 font-semibold">Vandaag met {child.name}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl">
            <Sparkles className="w-5 h-5 text-orange-700" />
            <span className="font-black text-orange-800">{sparkles}</span>
          </div>
        </motion.div>

        {/* Voortgang */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 rounded-2xl p-4 mb-6 overflow-x-auto"
        >
          <div className="flex justify-between min-w-[600px]">
            {storyPhases.map((phase, idx) => (
              <div key={phase.name} className="flex flex-col items-center gap-2 flex-1 relative">
                {idx < storyPhases.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-1 rounded-full ${
                      idx < currentPhase
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-purple-200"
                    }`}
                  />
                )}
                <motion.div
                  animate={
                    idx === currentPhase
                      ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(168,85,247,0)", "0 0 20px rgba(168,85,247,0.4)", "0 0 0px rgba(168,85,247,0)"] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10 border-3 ${
                    idx < currentPhase
                      ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-600"
                      : idx === currentPhase
                      ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white border-purple-600"
                      : "bg-purple-100 text-purple-400 border-purple-200"
                  }`}
                >
                  {idx < currentPhase ? "✓" : phase.icon}
                </motion.div>
                <span className="text-xs font-bold text-purple-500 text-center">
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Illustratie gebied */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-6 text-center relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={illustration.emoji}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-6xl mb-4 animate-float"
            >
              {illustration.emoji}
            </motion.div>
          </AnimatePresence>
          <motion.div
            key={illustration.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-purple-600"
          >
            {illustration.text}
          </motion.div>
          <motion.div
            key={illustration.subtext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-purple-400 italic mt-2"
          >
            {illustration.subtext}
          </motion.div>

          {/* Sterrenstof animatie */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -30, -60],
                scale: [0, 1, 0.5],
                x: [0, (i % 2 === 0 ? 20 : -20), 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute text-xl"
              style={{
                left: `${20 + i * 12}%`,
                top: "40%",
              }}
            >
              {["✨", "🌟", "⭐", "💫", "✨", "🌟"][i]}
            </motion.div>
          ))}
        </motion.div>

        {/* Chat gebied */}
        <div className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-purple-100 border-2 border-white/50">
          {!storyStarted ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-7 flex justify-center"
              >
                <ProfessorPluisAvatar size="large" />
              </motion.div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Ik heb stiekem al op je gewacht, {child.name}.
              </h2>
              <p className="text-purple-500 mb-8 max-w-md mx-auto">
                Er is een verhaal aangekomen dat nog een held mist. Zullen we
                samen ontdekken hoe het begint?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAdventure}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-pink-200 animate-pulse-glow"
              >
                ✨ Begin het avontuur
              </motion.button>
            </div>
          ) : (
            <>
              {/* Berichten */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="mr-3 flex-shrink-0">
                          <ProfessorPluisAvatar size="small" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-br-sm"
                            : "bg-white border-2 border-purple-100 text-purple-700 rounded-bl-sm"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="text-xs font-bold text-purple-500 mb-1">
                            Professor Pluis
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content || (
                            <span className="flex gap-1">
                              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Keuze knoppen */}
              <AnimatePresence>
                {showChoices && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <p className="text-purple-600 font-bold mb-3">Kies je avontuur:</p>
                    <div className="space-y-2">
                      {choiceOptions.map((choice) => (
                        <motion.button
                          key={choice.text}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => sendMessage(choice.text)}
                          className="w-full text-left px-5 py-4 bg-gradient-to-r from-white to-purple-50 border-2 border-purple-200 rounded-xl text-purple-700 font-bold hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                        >
                          {choice.emoji} {choice.text}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="flex gap-3 pt-4 border-t-2 border-purple-100">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Typ jouw idee..."
                  disabled={isLoading || showChoices}
                  className="flex-1 px-5 py-3 rounded-2xl border-2 border-purple-200 bg-white text-purple-700 placeholder-purple-300 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim() || showChoices}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Stuur
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <ProfessorPluisAvatar size="medium" />
      </div>
    }>
      <StoryContent />
    </Suspense>
  );
}
