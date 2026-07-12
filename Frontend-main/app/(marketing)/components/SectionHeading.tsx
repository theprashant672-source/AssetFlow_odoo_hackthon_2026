export default function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading__line">
        <span className="line-dash" />
        <h2>{title}</h2>
        <span className="line-dash" />
      </div>
      {sub ? <p className="section-heading__sub">{sub}</p> : null}
    </div>
  );
}

