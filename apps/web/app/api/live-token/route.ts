import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST() {
  try {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    return NextResponse.json({ token: token.name });
  } catch (err) {
    console.error("Token creation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create token" },
      { status: 500 }
    );
  }
}
