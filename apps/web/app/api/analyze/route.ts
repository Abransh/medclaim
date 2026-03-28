import { NextResponse } from "next/server";
import { callGemini, parseOutputs } from "@/lib/ai";
import { GENERATOR_PROMPT, AUDITOR_PROMPT } from "@/lib/prompts";
import type { AnalysisResult } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes?.trim()) {
      return NextResponse.json({ error: "No clinical notes provided" }, { status: 400 });
    }

    const generatorOutput = await callGemini(GENERATOR_PROMPT, notes);

    const auditorInput = `
=== ORIGINAL RAW NOTES ===
${notes}

=== GENERATOR OUTPUT ===
${generatorOutput}
`;
    const auditorOutput = await callGemini(AUDITOR_PROMPT, auditorInput);

    const result: AnalysisResult = parseOutputs(generatorOutput, auditorOutput);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analysis failed:", err);
    const message = err instanceof SyntaxError
      ? "AI returned invalid format. Please try again."
      : err instanceof Error
        ? err.message
        : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
