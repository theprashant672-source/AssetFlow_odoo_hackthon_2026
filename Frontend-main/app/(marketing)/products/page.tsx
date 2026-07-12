import Link from "next/link";
import Image from "next/image";

import SectionHeading from "../components/SectionHeading";
import { BoltIcon, ShieldIcon, StarIcon, WarnIcon } from "../components/icons";

export default function ProductsPage() {
  return (
    <main>
      <div className="page-hero">
        <SectionHeading title="Products" sub="Explore our hybrid inverter series" />
      </div>

      <section className="section products-preview">
        <div className="product-cards">
          {[
            {
              name: "NovaAssets SP SERIES",
              range: "Single Phase Inverters",
              warranty: "8 / 10 Years*",
              charging: "Fast 230A Charging",
              efficiency: "99.9% | MPPTs Efficiency",
              overload: "200% | Overload Tolerance",
              ip: "IP66 Rating Design",
              href: "/products/single-phase",
              image: { src: "/novaassetsspseries.svg", alt: "NovaAssets SP Series inverter" },
            },
            {
              name: "NovaAssets TP-L / TP-H SERIES",
              range: "Three Phase Inverters",
              warranty: "8 / 10 Years*",
              charging: "Fanless | Silent Design",
              efficiency: "99.9% | MPPTs Efficiency",
              overload: "150% | Overload Tolerance",
              ip: "IP65 / IP66 Rating Design",
              href: "/products/three-phase",
              image: { src: "/TP-L.svg", alt: "NovaAssets TP Series inverter" },
            },
          ].map((p) => (
            <Link key={p.name} className="product-card" href={p.href}>
              <div className="product-card__img">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 600px) 92vw, (max-width: 900px) 80vw, 360px"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h4>{p.name}</h4>
              <p className="product-card__range">{p.range}</p>
              <ul>
                <li>
                  <ShieldIcon /> {p.warranty}
                </li>
                <li>
                  <BoltIcon /> {p.charging}
                </li>
                <li>
                  <StarIcon /> {p.efficiency}
                </li>
                <li>
                  <WarnIcon /> {p.overload}
                </li>
                <li>
                  <ShieldIcon /> {p.ip}
                </li>
              </ul>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
