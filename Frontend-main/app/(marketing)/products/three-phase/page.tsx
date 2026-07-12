import Link from "next/link";

import ThreePhaseTabs from "./ThreePhaseTabs";

export default function ThreePhasePage() {
  return (
    <>
      <ThreePhaseTabs />
      <section className="cta-banner">
        <h2>Need a Single Phase Solution?</h2>
        <p>Our SP Series offers powerful single-phase hybrid inverters for residential applications.</p>
        <Link className="btn-primary" href="/products/single-phase">
          View SP Series
        </Link>
      </section>
    </>
  );
}

