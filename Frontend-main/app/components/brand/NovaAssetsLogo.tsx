"use client";

export default function NovaAssetsLogo({ size = 48 }: { size?: number }) {
  return (
    <img
      src="/novaassets_logo.webp"
      alt="NovaAssets"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}

