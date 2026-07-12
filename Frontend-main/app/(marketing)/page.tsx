import Image from "next/image";
import Link from "next/link";

import SectionHeading from "./components/SectionHeading";
import { BoltIcon, CheckIcon, ShieldIcon, StarIcon, WarnIcon } from "./components/icons";

export default function HomePage() {
  const partners = [
    { name: "AIS", logo: "/ais.png" },
    { name: "Azure Power", logo: "/azurepower.png" },
    { name: "BluPine Energy", logo: "/bluepine.jpeg" },
    { name: "candi.", logo: "/candi.png" },
    { name: "CleanMax", logo: "/cleanmax.jpeg" },
    { name: "EESL", logo: "/eesl.jpg" },
    { name: "Fourth Partner Energy", logo: "/fourthpartnerenergy.jpeg" },
  ];

  return (
    <main>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Powering Homes,
              <br />
              <span>Empowering Futures.</span>
            </h1>
            <p className="hero-sub">Easy Inverter Monitoring and Control via Mobile App</p>
            <div className="hero-actions">
              <Link className="btn-primary" href="/about">
                Discover More →
              </Link>
            </div>
          </div>
          <div className="hero-mockup">
            <div className="hero-image">
              <Image
                src="/hero.png"
                alt="NovaAssets hybrid inverter hero"
                width={1643}
                height={640}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section foundation">
        <SectionHeading title="Our Foundation Journey" sub="Built on Decades of Solar Expertise" />
        <div className="foundation-grid">
          <div className="foundation-text">
            <h3 className="brand-name">NovaAssets</h3>
            <p className="brand-tag">Your Power Partner</p>
            <p className="brand-sub">Powering Homes, Empowering Futures.</p>
            <ul className="foundation-list">
              <li>
                <CheckIcon />{" "}
                <div>
                  <strong>Established Expertise:</strong> Founded in 2025, NovaAssets is a proud group
                  company of Sunce Renewables Private Limited, a company with decades of expertise
                  in solar inverter repair and maintenance.
                </div>
              </li>
              <li>
                <CheckIcon />{" "}
                <div>
                  <strong>Renewable Energy Leadership:</strong> We have built a robust reputation
                  with one of the country&apos;s most trusted service centers, known for handling
                  Central, String, and Hybrid inverters with unmatched quality and cost-effectiveness.
                </div>
              </li>
              <li>
                <CheckIcon />{" "}
                <div>
                  <strong>Tailored Solutions:</strong> Our nationwide network of highly skilled
                  engineers ensures reliable, timely, and professional service for our customers.
                </div>
              </li>
              <li>
                <CheckIcon />{" "}
                <div>
                  <strong>Skilled Professionals:</strong> Drawing on this legacy, we have now
                  ventured into manufacturing with our own cutting-edge series of NovaAssets Hybrid
                  Inverters, engineered for intelligence, reliability, and performance, to redefine
                  energy solutions for a sustainable future.
                </div>
              </li>
            </ul>
            <Link className="btn-primary" href="/about">
              Read More →
            </Link>
          </div>
          <div className="foundation-image">
            <div className="foundation-photo">
              <Image
                src="/novaassets.png"
                alt="NovaAssets inverter"
                width={1024}
                height={1024}
                sizes="(max-width: 900px) 92vw, 420px"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section products-preview">
        <div className="product-cards">
          {[
            {
              name: "NovaAssets SP Series",
              range: "Single Phase (3-12kW)",
              image: "/Single Phase (3-12kW).svg",
              warranty: "8 / 10 Years*",
              charging: "Fast 230A Charging",
              efficiency: "99.9% | MPPTs Efficiency",
              overload: "200% | Overload Tolerance",
              ip: "IP66 Rating Design",
              href: "/products/single-phase",
            },
            {
              name: "NovaAssets TP-L Series",
              range: "Three Phase (8-12kW)",
              image: "/Three Phase (8-12kW).svg",
              warranty: "8 / 10 Years*",
              charging: "Fanless | Silent Design",
              efficiency: "99.9% | MPPTs Efficiency",
              overload: "150% | Overload Tolerance",
              ip: "IP65 Rating Design",
              href: "/products/three-phase",
            },
            {
              name: "NovaAssets TP-H Series",
              range: "Three Phase (15-50kW)",
              image: "/Three Phase (15-50kW).svg",
              warranty: "8 / 10 Years*",
              charging: "Fanless | Silent Design",
              efficiency: "99.9% | MPPTs Efficiency",
              overload: "150% | Overload Tolerance",
              ip: "IP66 Rating Design",
              href: "/products/three-phase",
            },
          ].map((p) => (
            <Link key={p.name} className="product-card" href={p.href}>
              <div className="product-card__img">
                <Image
                  src={encodeURI(p.image)}
                  alt={`${p.name} inverter`}
                  fill
                  sizes="(max-width: 900px) 92vw, 360px"
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

      <section className="section trusted">
        <SectionHeading title="Trusted by India's Industry Leaders" sub="Partnering for a Powerful Future." />
        <div className="partners-marquee" aria-label="Trusted partners">
          <div className="marquee">
            <div className="marquee-track">
              {partners.concat(partners).map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="partner-card" role="listitem" aria-label={p.name}>
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    sizes="240px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section core">
        <SectionHeading title="The NovaAssets Core" sub="Where Legacy Meets Innovation. Your Partner in a Powered Future." />
        <div className="core-grid">
          {[
            {
              icon: "🛡️",
              title: "Why Choose Us",
              desc: "Nationwide network of highly skilled engineers with unmatched quality, speed, and cost-effectiveness. Comprehensive end-to-end support, including government subsidies.",
            },
            {
              icon: "📖",
              title: "Our Story",
              desc: "We have leveraged our deep industry knowledge to design a cutting-edge series of Hybrid Inverters, setting a new standard for performance and reliability.",
            },
            {
              icon: "🌱",
              title: "Our Mission",
              desc: "Our mission is to redefine energy solutions for a sustainable future. We are committed to deliver innovative, reliable, and intelligent solar inverters that make clean energy accessible and effortless for everyone.",
            },
            {
              icon: "🌍",
              title: "Our Vision",
              desc: "To be a global leader in the sustainable energy ecosystem, consistently innovating to provide intelligent, high-performance energy solutions that simplify the transition to a clean energy world for homes and beyond.",
            },
          ].map((c) => (
            <div key={c.title} className="core-card">
              <span className="core-card__icon">{c.icon}</span>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
