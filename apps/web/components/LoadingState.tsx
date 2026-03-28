"use client";

import type { AnalysisStep } from "@/lib/types";

const steps = [
  { key: "extracting", label: "Extracting text from image..." },
  { key: "generating", label: "Generating structured documentation & codes..." },
  { key: "auditing", label: "Running insurance risk audit..." },
] as const;

export default function LoadingState({ step }: { step: AnalysisStep }) {
  const activeIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {steps.map((s, i) => {
          const isActive = s.key === step;
          const isComplete = activeIndex > i || (step === "complete" && true);
          const isPending = activeIndex < i && step !== "complete";

          if (s.key === "extracting" && step !== "extracting") return null;

          return (
            <div key={s.key} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  isComplete
                    ? "bg-teal-100 text-teal-700"
                    : isActive
                      ? "animate-pulse bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isComplete ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "font-medium text-slate-900" : isPending ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 rounded bg-slate-100" style={{ width: `${90 - i * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
