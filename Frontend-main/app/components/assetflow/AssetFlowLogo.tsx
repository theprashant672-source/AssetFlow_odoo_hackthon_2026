type AssetFlowLogoProps = {
  size?: number;
  compact?: boolean;
};

const ODOO_PURPLE = "#9A528D";

function OdooWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 268 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="34" cy="72" r="24" stroke="white" strokeWidth="17" />
      <circle cx="100" cy="72" r="24" stroke="white" strokeWidth="17" />
      <line x1="124" y1="10" x2="124" y2="72" stroke="white" strokeWidth="17" strokeLinecap="round" />
      <circle cx="166" cy="72" r="24" stroke="white" strokeWidth="17" />
      <circle cx="232" cy="72" r="24" stroke="white" strokeWidth="17" />
    </svg>
  );
}

export default function AssetFlowLogo({ size = 44, compact = false }: AssetFlowLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-[1.1rem] shadow-[0_18px_40px_rgba(154,82,141,0.35)]"
        style={{ width: size, height: size, backgroundColor: ODOO_PURPLE }}
        aria-hidden="true"
      >
        <OdooWordmark className="w-[78%]" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-base font-black tracking-tight">
            <span style={{ color: ODOO_PURPLE }}>odoo</span>{" "}
            <span className="text-slate-900">Assetflow</span>
          </div>
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Enterprise Assets</div>
        </div>
      )}
    </div>
  );
}
