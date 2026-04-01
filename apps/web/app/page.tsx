"use client";

import { useState } from "react";
import type { AnalysisResult, AnalysisStep } from "@/lib/types";
import NoteInput from "@/components/NoteInput";
import LoadingState from "@/components/LoadingState";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!notes.trim()) return;

    setError(null);
    setResults(null);
    setStep("generating");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      setStep("auditing");
      const data: AnalysisResult = await res.json();
      setResults(data);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  async function handleExtractImage(file: File) {
    setStep("extracting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Extraction failed");
      }

      const { text } = await res.json();
      setNotes((prev) => (prev ? prev + "\n\n" + text : text));
      setStep("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract text from image");
      setStep("idle");
    }
  }

  const isLoading = step === "generating" || step === "auditing";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-teal-600">MedClaim</span> AI
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Psychiatric billing assistant — structure notes, suggest codes, check risk
        </p>
      </header>

      <div className="space-y-6">
        <NoteInput
          value={notes}
          onChange={setNotes}
          onAnalyze={handleAnalyze}
          onExtractImage={handleExtractImage}
          isLoading={isLoading}
          isExtracting={step === "extracting"}
        />

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={handleAnalyze}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {isLoading && <LoadingState step={step} />}

        {results && step === "complete" && <ResultsPanel results={results} />}
      </div>
    </div>
  );
}
