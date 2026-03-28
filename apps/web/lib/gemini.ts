import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

const OCR_PROMPT = `You are a medical document OCR system. Extract ALL text from this image of clinical/medical notes.

Rules:
- Extract every word, number, abbreviation, and symbol exactly as written
- Preserve line breaks and structure where visible
- If handwritten, do your best to interpret — flag anything truly illegible as [illegible]
- Include all medical abbreviations as-is (hx, dx, rx, yo, etc.)
- Do NOT interpret, summarize, or restructure — just extract raw text
- If there are multiple sections or columns, extract left-to-right, top-to-bottom

Return ONLY the extracted text, nothing else.`;

export async function extractTextFromImage(base64Data: string, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: OCR_PROMPT },
        ],
      },
    ],
    config: {},
  });

  return response.text ?? "";
}
