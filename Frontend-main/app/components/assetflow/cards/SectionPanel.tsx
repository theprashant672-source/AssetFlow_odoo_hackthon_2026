export default function SectionPanel({
  title,
  subtitle,
  children,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="glass-panel soft-shadow rounded-2xl p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-black tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
