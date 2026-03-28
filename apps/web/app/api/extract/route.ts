import { NextResponse } from "next/server";
import { extractTextFromImage } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const text = await extractTextFromImage(base64, file.type);

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Extraction failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
