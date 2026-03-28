"use client";

import { useRef, useState } from "react";

interface ImageCaptureProps {
  onExtract: (file: File) => void;
  isExtracting: boolean;
}

export default function ImageCapture({ onExtract, isExtracting }: ImageCaptureProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onExtract(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={isExtracting}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {isExtracting ? "Extracting..." : "Camera"}
      </button>

      {preview && (
        <div className="mt-2 inline-block">
          <img
            src={preview}
            alt="Captured"
            className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
          />
        </div>
      )}
    </>
  );
}
