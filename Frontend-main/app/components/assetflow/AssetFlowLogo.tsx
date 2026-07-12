type AssetFlowLogoProps = {
  size?: number;
  compact?: boolean;
};

export default function AssetFlowLogo({ size = 44, compact = false }: AssetFlowLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#5b3df5,#7c6af7_55%,#4c1d95)] text-white shadow-[0_18px_40px_rgba(91,61,245,0.35)]"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <span className="text-[0.86em] font-black tracking-[0.08em]">AF</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-base font-black tracking-[0.22em] text-slate-900">ASSETFLOW</div>
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Enterprise Assets</div>
        </div>
      )}
    </div>
  );
}
