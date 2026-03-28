"use client";

import { useCallback, useRef, useState } from "react";

const LIVE_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

interface UseGeminiLiveOptions {
  onTranscript: (text: string) => void;
}

export function useGeminiLive({ onTranscript }: UseGeminiLiveOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    workletRef.current?.disconnect();
    workletRef.current = null;
    contextRef.current?.close();
    contextRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    setIsListening(false);
    setIsConnecting(false);
  }, []);

  const start = useCallback(async () => {
    if (isListening || isConnecting) return;
    setIsConnecting(true);

    try {
      const tokenRes = await fetch("/api/live-token", { method: "POST" });
      if (!tokenRes.ok) throw new Error("Failed to get token");
      const { token } = await tokenRes.json();

      const ws = new WebSocket(`${LIVE_WS_URL}?access_token=${token}`);
      wsRef.current = ws;

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = () => reject(new Error("WebSocket connection failed"));
        setTimeout(() => reject(new Error("Connection timeout")), 10000);
      });

      ws.send(JSON.stringify({
        setup: {
          model: "models/gemini-3.1-flash-live-preview",
          generationConfig: {
            responseModalities: ["TEXT"],
          },
          inputAudioTranscription: {},
        },
      }));

      await new Promise<void>((resolve, reject) => {
        const handler = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.setupComplete) {
            ws.removeEventListener("message", handler);
            resolve();
          }
        };
        ws.addEventListener("message", handler);
        setTimeout(() => reject(new Error("Setup timeout")), 10000);
      });

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transcription = data?.serverContent?.inputTranscription?.text;
          if (transcription) {
            onTranscript(transcription);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => stop();
      ws.onerror = () => stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      contextRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule(createWorkletURL());

      const source = audioCtx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioCtx, "pcm-processor");
      workletRef.current = worklet;

      worklet.port.onmessage = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = arrayBufferToBase64(e.data);
          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{
                mimeType: "audio/pcm;rate=16000",
                data: base64,
              }],
            },
          }));
        }
      };

      source.connect(worklet);
      worklet.connect(audioCtx.destination);

      setIsListening(true);
      setIsConnecting(false);
    } catch (err) {
      console.error("Gemini Live start failed:", err);
      stop();
    }
  }, [isListening, isConnecting, onTranscript, stop]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isListening, isConnecting, toggle, stop };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createWorkletURL(): string {
  const code = `
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const float32 = input[0];
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;
  const blob = new Blob([code], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
