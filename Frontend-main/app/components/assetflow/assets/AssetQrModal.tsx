"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function assetPublicUrl(assetId: string): string {
  if (typeof window === "undefined") return `/asset/${assetId}`;
  return `${window.location.origin}/asset/${assetId}`;
}

export default function AssetQrModal({
  asset,
  onClose,
}: {
  asset: { id: string; tag: string; name: string; location?: string; categoryName?: string };
  onClose: () => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(assetPublicUrl(asset.id), {
      width: 512,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [asset.id]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${asset.tag || asset.id}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const win = window.open("", "_blank", "width=420,height=560");
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>Asset Label — ${asset.tag}</title></head>
        <body style="font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;margin:0;">
          <div style="border:2px solid #0f172a;border-radius:16px;padding:24px;text-align:center;">
            <img src="${qrDataUrl}" style="width:220px;height:220px;" />
            <div style="font-size:20px;font-weight:800;margin-top:12px;">${asset.tag}</div>
            <div style="font-size:14px;color:#475569;margin-top:4px;">${asset.name}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:8px;">Scan to view asset details</div>
          </div>
          <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Asset QR Code</h3>
            <p className="mt-1 text-sm text-slate-500">Scan with any phone camera to open details.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none" aria-label="Close">
            ×
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR code for ${asset.tag}`} className="h-52 w-52 rounded-lg bg-white p-2 shadow-sm" />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center text-sm text-slate-400 animate-pulse">
              Generating QR...
            </div>
          )}
          <div className="mt-4 text-center">
            <div className="text-lg font-black tracking-tight text-slate-900">{asset.tag}</div>
            <div className="text-sm font-medium text-slate-600">{asset.name}</div>
            {asset.location && <div className="mt-1 text-xs text-slate-400">{asset.location}</div>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Download PNG
          </button>
          <button
            onClick={handlePrint}
            disabled={!qrDataUrl}
            className="rounded-xl bg-[#5b3df5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4b30d6] disabled:opacity-50"
          >
            Print Label
          </button>
        </div>
      </div>
    </div>
  );
}
