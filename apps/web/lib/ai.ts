import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  return response.text ?? "";
}

function cleanJson(str: string): string {
  return str.replace(/```json\n?|```\n?/g, "").trim();
}

export function parseOutputs(generatorRaw: string, auditorRaw: string) {
  const generator = JSON.parse(cleanJson(generatorRaw));
  const auditor = JSON.parse(cleanJson(auditorRaw));

  return {
    ...generator,
    ...auditor,
  };
}
