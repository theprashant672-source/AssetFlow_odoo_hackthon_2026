"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId = 0;
    let stopped = false;

    const handleResult = (text: string) => {
      if (stopped) return;
      stopped = true;
      setScanned(true);
      // QR contains either a full /asset/{id} URL or a raw asset id.
      try {
        const url = new URL(text);
        if (url.pathname.startsWith("/asset/")) {
          router.push(url.pathname);
          return;
        }
        window.location.href = text;
      } catch {
        router.push(`/asset/${encodeURIComponent(text)}`);
      }
    };

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code?.data) {
            handleResult(code.data);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
          rafId = requestAnimationFrame(tick);
        }
      })
      .catch(() => setError("Camera access denied. Allow camera permission and reload, or enter the asset ID below."));

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [router]);

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("assetId");
    const value = String(input ?? "").trim();
    if (value) router.push(`/asset/${encodeURIComponent(value)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">AssetFlow</div>
          <h1 className="mt-1 text-2xl font-black tracking-tight">Scan Asset QR</h1>
          <p className="mt-2 text-sm text-slate-400">Point your camera at an asset label to open its details.</p>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-square">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className={`h-56 w-56 rounded-2xl border-2 ${scanned ? "border-emerald-400" : "border-white/60"} shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]`} />
          </div>

          {scanned && (
            <div className="absolute inset-x-0 bottom-4 text-center text-sm font-bold text-emerald-400">
              ✓ QR detected — opening asset...
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-center text-sm text-slate-300">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleManualSubmit} className="mt-6 flex gap-2">
          <input
            name="assetId"
            placeholder="Or enter asset ID manually..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#5b3df5]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#5b3df5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4b30d6]"
          >
            Open
          </button>
        </form>
      </div>
    </main>
  );
}
