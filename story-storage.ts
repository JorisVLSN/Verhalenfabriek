"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;

  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return (
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition ??
    null
  );
}

export function ReadAloudButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "nl-BE";
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      className="speech-action"
      aria-label={isSpeaking ? "Stop met voorlezen" : "Lees dit bericht voor"}
    >
      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      {isSpeaking ? "Stop" : "Lees voor"}
    </button>
  );
}

export function VoiceAnswerButton({
  disabled,
  onTranscript,
}: {
  disabled?: boolean;
  onTranscript: (text: string) => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const Recognition = getSpeechRecognition();
    setIsSupported(Boolean(Recognition));

    return () => recognitionRef.current?.stop();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "nl-BE";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0]?.transcript ?? "";
      }
      if (transcript.trim()) onTranscript(transcript.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    setIsListening(true);
    recognition.start();
  };

  if (!isSupported) {
    return (
      <span className="voice-not-supported">
        Spraak werkt het best in Chrome
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`voice-answer-button ${isListening ? "is-listening" : ""}`}
      aria-label={isListening ? "Stop met luisteren" : "Spreek je antwoord in"}
    >
      {isListening ? <MicOff size={23} /> : <Mic size={23} />}
      <span>{isListening ? "Ik luister…" : "Vertel het"}</span>
    </button>
  );
}
