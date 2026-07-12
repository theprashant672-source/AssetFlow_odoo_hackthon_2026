import Image from "next/image";
import Link from "next/link";

import SectionHeading from "../components/SectionHeading";
import { BoltIcon, CheckIcon, PhoneIcon, ShieldIcon } from "../components/icons";

export default function AboutPage() {
  return (
    <main>
      <div className="page-hero">
        <SectionHeading title="About NovaAssets" sub="Your Power Partner for Energy Independence" />
      </div>

      <section className="section about-block">
        <div className="about-grid">
          <div className="about-text">
            <h3>Smart Technology for Smart Savings</h3>
            <p className="about-intro">
              NovaAssets Hybrid Solar Smart Inverters bring together smart technology and reliable
              service. We seamlessly combine solar generation, battery storage, and grid power to
              give you continuous energy, lower bills, and freedom from outages.
            </p>
            <ul className="about-list">
              <li>
                <CheckIcon />
                <div>
                  <strong>High-Efficiency:</strong> Our inverters use MPPT technology to maximize
                  solar energy and store it for when you need it.
                </div>
              </li>
              <li>
                <CheckIcon />
                <div>
                  <strong>Intelligent Control:</strong> Features like intelligent scheduling and
                  automatic power source switching keep your costs down and you in control.
                </div>
              </li>
              <li>
                <CheckIcon />
                <div>
                  <strong>Built to Last:</strong> With an IP66 enclosure and advanced safety, these
                  inverters are durable and scalable for future needs.
                </div>
              </li>
            </ul>
            <Link className="btn-primary" href="/products/single-phase">
              Read More →
            </Link>
          </div>
          <div className="about-image">
            <div className="about-photo">
              <Image
                src="/smart.svg"
                alt="Smart technology for smart savings"
                fill
                unoptimized
                sizes="(max-width: 900px) 92vw, 420px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section about-block about-block--reverse">
        <div className="about-grid">
          <div className="about-image">
            <div className="about-photo">
              <Image
                src="/unmatched.webp"
                alt="Unmatched service and reliability"
                fill
                sizes="(max-width: 900px) 92vw, 420px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="about-text">
            <h3>Unmatched Service &amp; Reliability</h3>
            <p>
              We stand by our commitment to unmatched service and reliability. We are offering 24/7
              round-the-clock doorstep support from trained technicians and a nationwide service
              network that ensures quick response times.
            </p>
            <ul className="about-list">
              <li>
                <PhoneIcon />
                <div>
                  <strong>24/7 Support:</strong> We offer round-the-clock doorstep customer support
                  from trained technicians.
                </div>
              </li>
              <li>
                <BoltIcon />
                <div>
                  <strong>Fast Response:</strong> Our nationwide service network ensures quick
                  response times, End-to-End support with Subsidy &amp; fast install.
                </div>
              </li>
              <li>
                <ShieldIcon />
                <div>
                  <strong>8-Year Warranty:</strong> We provide a comprehensive, hassle-free warranty
                  for your peace of mind.
                </div>
              </li>
            </ul>
            <Link className="btn-primary" href="/contact">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      <section className="section stats-bar">
        {[
          { num: "10+", label: "Years of Service", sub: "Over 10 years of service experience" },
          { num: "50+", label: "Service Team", sub: "50+ trained engineers" },
          { num: "24×7", label: "Pan India", sub: "End-to-end Support with Subsidy and Fast Install" },
          { num: "8", label: "Years Warranty", sub: "Comprehensive, hassle-free warranty" },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-sub">{s.sub}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <SectionHeading title="Our Team" sub="Brains behind vision for cleaner and green energy." />
        <div className="team-grid">
          {[
            { name: "Vivek Dutt", role: "Chief Executive Officer & Co Founder", photo: "/team1.webp" },
            { name: "Ajeet Mishra", role: "Chief Technical Officer & Co Founder", photo: "/team2.webp" },
          ].map((m) => (
            <div key={m.photo} className="team-card">
              <div className="team-photo">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="(max-width: 900px) 92vw, 420px"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <div className="team-overlay">
                  <p className="team-name">{m.name}</p>
                  <p className="team-role">{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          title="Our Commitment"
          sub="NovaAssets is more than just an inverter; it's a reliable partner for your energy independence."
        />
        <div className="core-grid">
          {[
            {
              icon: "💡",
              title: "Smart Technology",
              desc: "Smart AI control for Solar, Battery & Grid. Our inverters use intelligent controls to maximize savings and keep you in control.",
            },
            {
              icon: "🕐",
              title: "24/7 Support",
              desc: "We offer round-the-clock doorstep customer support from trained technicians to ensure you're never left in the dark.",
            },
            {
              icon: "🛡️",
              title: "Built to Last",
              desc: "Featuring a dustproof and waterproof IP66 rating, our inverters are designed for durability and a long equipment life.",
            },
            {
              icon: "🔧",
              title: "End-to-End Service",
              desc: "Our nationwide network provides end-to-end support, including help with subsidies and fast installation.",
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

      <section className="cta-banner">
        <h2>Become Your Own Power Partner</h2>
        <p>
          Join us in moving towards a future of energy independence. Get continuous energy, lower
          bills, and freedom from outages with a reliable partner you can trust.
        </p>
        <Link className="btn-primary" href="/contact">
          Get in Touch
        </Link>
      </section>
    </main>
  );
}
