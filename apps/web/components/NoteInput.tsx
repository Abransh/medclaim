"use client";

import { useCallback, useRef } from "react";
import ImageCapture from "./ImageCapture";
import { SAMPLE_NOTES } from "@/lib/prompts";
import { useGeminiLive } from "@/hooks/useGeminiLive";

interface NoteInputProps {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  onExtractImage: (file: File) => void;
  isLoading: boolean;
  isExtracting: boolean;
}

export default function NoteInput({ value, onChange, onAnalyze, onExtractImage, isLoading, isExtracting }: NoteInputProps) {
  const valueRef = useRef(value);
  valueRef.current = value;

  const handleTranscript = useCallback((text: string) => {
    const current = valueRef.current;
    const separator = current && !current.endsWith(" ") ? " " : "";
    onChange(current + separator + text);
  }, [onChange]);

  const { isListening, isConnecting, toggle } = useGeminiLive({
    onTranscript: handleTranscript,
  });

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste clinical notes here, or use camera/voice to capture..."
        className="w-full min-h-[200px] rounded-xl border border-slate-300 bg-white p-4 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-y"
        disabled={isLoading}
      />

      <div className="flex flex-wrap items-center gap-2">
        <ImageCapture onExtract={onExtractImage} isExtracting={isExtracting} />

        <button
          type="button"
          onClick={toggle}
          disabled={isConnecting}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition ${
            isListening
              ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
              : isConnecting
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isListening && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
          {isConnecting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          {isConnecting ? "Connecting..." : isListening ? "Stop" : "Dictate"}
        </button>

        <button
          type="button"
          onClick={() => onChange(SAMPLE_NOTES)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          Load Sample
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !value.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze Notes"
          )}
        </button>
      </div>
    </div>
  );
}
