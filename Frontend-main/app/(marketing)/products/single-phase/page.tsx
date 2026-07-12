import Image from "next/image";
import Link from "next/link";

import SectionHeading from "../../components/SectionHeading";
import { BoltIcon, CheckIcon, ShieldIcon, WarnIcon } from "../../components/icons";

const spSpecs = [
  { label: "Battery Type", vals: ["Lithium-ion & Lead-acid", "", "", ""] },
  { label: "Rated Battery Voltage (Vdc)", vals: ["48", "", "", ""] },
  { label: "Battery Voltage Range (Vdc)", vals: ["40-60", "", "", ""] },
  { label: "Max. Charge/Discharge Current (A)", vals: ["80/100", "125/135", "180/180", "200/200", "230/230"] },
  { label: "Forced Wake-up by PV", vals: ["Yes", "", "", ""] },
  { label: "Max. Input Power (W)", vals: ["8000", "12000", "", "15000", "18000"] },
  { label: "Max. Input Voltage (Vdc)", vals: ["500", "", "", ""] },
  { label: "Rated Input Voltage (Vdc)", vals: ["370", "", "", ""] },
  { label: "Start-Up Voltage (Vdc)", vals: ["100", "", "100", ""] },
  { label: "MPPT Voltage Range (Vdc)", vals: ["60-450", "", "", "100-425"] },
  { label: "No. of MPPT/Strings Per MPPT", vals: ["1/2", "", "", "3/2+1+1"] },
  { label: "Max. Input Current Per MPPT (A)", vals: ["28", "", "", "28/16/16"] },
  { label: "Max. Short Circuit Current Per MPPT (A)", vals: ["35", "", "", "44/25/25"] },
  { label: "Rated Grid Voltage (Vac)", vals: ["220/230/240 ±15%", "", "L/N/PE, 230", ""] },
  { label: "Rated Grid Frequency (Hz)", vals: ["50/60", "", "", ""] },
  { label: "Rated Grid-Tied Power (W)", vals: ["", "", "8000", "10000", "12000"] },
  { label: "Rated Grid-Tied Current (A)", vals: ["", "", "34.8", "43.5", "52.2"] },
  { label: "Max Grid-Tied Apparent Power (VA)", vals: ["", "", "8800", "11000", "13200"] },
  { label: "Max Grid-Tied Current (A)", vals: ["", "", "40", "50", "60"] },
  { label: "Max Input Apparent Power (VA)", vals: ["", "", "12000", "15000", "18000"] },
  { label: "Max Input Current (A)", vals: ["26", "52.2", "65.2", "78.3", ""] },
  { label: "Total Harmonic Distortion (THDI)", vals: ["3%", "", "", ""] },
  { label: "Displacement Power Factor", vals: ["0.8 leading to 0.8 lagging", "", "", ""] },
  { label: "Rated Output Power (W)", vals: ["3000", "6000", "8000", "10000", "12000"] },
  { label: "Rated Output Current (A)", vals: ["18", "27", "34.8", "43.5", "52.2"] },
  { label: "Rated Output Frequency (Hz)", vals: ["50/60 ±0.1%", "", "", ""] },
  {
    label: "Overload Capability",
    vals: ["1min@101-110%, 10s@110%-150%, 5s@150%-200%, 100ms@ > 200%", "110%, continuous; 200%, 10s", "", ""],
  },
  { label: "Switch Time (ms)", vals: ["10", "", "", ""] },
  { label: "Total Harmonic Distortion (THDV)", vals: ["3%", "", "", ""] },
  { label: "Max. Efficiency", vals: ["97.00%", "", "97.80%", ""] },
  { label: "MPPT Efficiency", vals: ["99.90%", "", "", ""] },
  {
    label: "Integrated Protection",
    vals: [
      "PV Reverse-polarity Protection, PV Insulation Detection, Ground Fault Monitoring, Over Current Protection, Over Voltage Protection",
      "",
      "",
      "",
    ],
  },
  { label: "Surge Protection", vals: ["DC Type II/AC Type III", "DC Type II/AC Type II", "", ""] },
  { label: "Over Voltage Category", vals: ["OVC II (DC), OVC III (AC)", "", "", ""] },
  { label: "Operating Temperature (°C)", vals: ["-25 to +60 (Above 45°C Derating)", "-40~+60 (Above 45°C Derating)", "", ""] },
  { label: "Dimensions [W*H*D] (mm)", vals: ["450*570*268", "395*485*156", "", ""] },
  { label: "Weight (kg)", vals: ["39", "14.5", "", ""] },
  { label: "Topology", vals: ["Transformerless", "Non-Isolated", "", ""] },
  { label: "Altitude (m)", vals: ["3000", "", "", ""] },
  { label: "Protection Level", vals: ["IP66", "", "", ""] },
  {
    label: "Communication",
    vals: [
      "RS485, WIFI/GPRS, CAN2.0",
      "RS232/RS485/CAN/Dry contact/External battery NTC/ Parallel communication/WIFI (optional)",
      "",
      "",
    ],
  },
  { label: "Warranty", vals: ["8 Years (Standard) / 10 Years (Optional)", "", "", ""] },
  { label: "Max. No. of Parallel Units", vals: ["6", "", "", ""] },
  {
    label: "Grid Standards",
    vals: [
      "VDE-AR-N 4105, VDE V 0126-1-1, CEI 0-21, G98/G99, EN 50438/EN50549, NRS 097",
      "",
      "",
      "",
    ],
  },
  {
    label: "Safety Standards",
    vals: [
      "IEC 62109-1:2010, EN 62109-1:2010, IEC 62109-2:2011, EN 62109-2:2011, IEC/EN 62109-1, IEC/EN 62109-2",
      "",
      "",
      "",
    ],
  },
  {
    label: "EMC Standards",
    vals: [
      "EN IEC 61000-6-1:2019, EN IEC 61000-6-2:2019, EN 61000-3-12:2011, EN IEC 61000-3-11:2019",
      "",
      "",
      "",
    ],
  },
];

const spModels = ["3kW", "6kW", "8kW", "10kW", "12kW"];

const spSections: { label: string; rows: string[] }[] = [
  {
    label: "Battery Data",
    rows: ["Battery Type", "Rated Battery Voltage (Vdc)", "Battery Voltage Range (Vdc)", "Max. Charge/Discharge Current (A)", "Forced Wake-up by PV"],
  },
  {
    label: "PV Input",
    rows: [
      "Max. Input Power (W)",
      "Max. Input Voltage (Vdc)",
      "Rated Input Voltage (Vdc)",
      "Start-Up Voltage (Vdc)",
      "MPPT Voltage Range (Vdc)",
      "No. of MPPT/Strings Per MPPT",
      "Max. Input Current Per MPPT (A)",
      "Max. Short Circuit Current Per MPPT (A)",
    ],
  },
  {
    label: "Grid Input & Output",
    rows: [
      "Rated Grid Voltage (Vac)",
      "Rated Grid Frequency (Hz)",
      "Rated Grid-Tied Power (W)",
      "Rated Grid-Tied Current (A)",
      "Max Grid-Tied Apparent Power (VA)",
      "Max Grid-Tied Current (A)",
      "Max Input Apparent Power (VA)",
      "Max Input Current (A)",
      "Total Harmonic Distortion (THDI)",
      "Displacement Power Factor",
    ],
  },
  {
    label: "Backup Data",
    rows: ["Rated Output Power (W)", "Rated Output Current (A)", "Rated Output Frequency (Hz)", "Overload Capability", "Switch Time (ms)", "Total Harmonic Distortion (THDV)"],
  },
  { label: "Efficiency", rows: ["Max. Efficiency", "MPPT Efficiency"] },
  { label: "Protection", rows: ["Integrated Protection", "Surge Protection", "Over Voltage Category"] },
  {
    label: "General Data",
    rows: [
      "Operating Temperature (°C)",
      "Dimensions [W*H*D] (mm)",
      "Weight (kg)",
      "Topology",
      "Altitude (m)",
      "Protection Level",
      "Communication",
      "Warranty",
      "Max. No. of Parallel Units",
    ],
  },
  { label: "Standards", rows: ["Grid Standards", "Safety Standards", "EMC Standards"] },
];

function getSpecVal(label: string, colIdx: number): string {
  const row = spSpecs.find((r) => r.label === label);
  if (!row) return "—";
  const v = row.vals[colIdx];
  if (!v || v === "") {
    const first = row.vals.find((x) => x && x !== "");
    return first || "—";
  }
  return v;
}

export default function SinglePhasePage() {
  return (
    <main>
      <div className="page-hero">
        <SectionHeading title="Products" sub="Single Phase Inverters" />
      </div>

      <section className="section product-intro">
        <div className="product-intro-grid">
          <div>
            <h2 className="product-series-title">NovaAssets SP SERIES</h2>
            <p className="product-series-sub">AW-SP 3000 to 12000 Series</p>
            <ul className="about-list">
              <li>
                <BoltIcon />
                <div>
                  <strong>Fast 230A Charging:</strong> Quick 230A charging and discharging reduce wait
                  times, enhancing efficiency.
                </div>
              </li>
              <li>
                <BoltIcon />
                <div>
                  <strong>Flexible Paralleling:</strong> Easily expandable with paralleling
                  capabilities for diverse scenarios.
                </div>
              </li>
              <li>
                <CheckIcon />
                <div>
                  <strong>Smart Monitoring via Mobile App:</strong> Remote monitoring for convenient
                  operation.
                </div>
              </li>
              <li>
                <CheckIcon />
                <div>
                  <strong>Low Voltage Wake-Up:</strong> Battery forced wake-up during lower voltage
                  improves stability and extends generation duration.
                </div>
              </li>
              <li>
                <WarnIcon />
                <div>
                  <strong>200% Overload Tolerance:</strong> Supports 2x the transient overload for
                  greater reliability.
                </div>
              </li>
              <li>
                <ShieldIcon />
                <div>
                  <strong>IP66 Rating Design:</strong> Dustproof and waterproof design ensures long
                  equipment life.
                </div>
              </li>
            </ul>
          </div>
          <div className="product-image">
            <div className="product-photo">
              <Image
                src="/novaassetsspseries.svg"
                alt="NovaAssets SP Series inverter"
                fill
                unoptimized
                sizes="(max-width: 900px) 92vw, 560px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeading title="Technical Specifications" sub="NovaAssets SP SERIES (3kW - 12kW)" />
        <div className="spec-table-wrapper">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Model</th>
                {spModels.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            {spSections.map((sec) => (
              <tbody key={sec.label}>
                <tr className="spec-section-row">
                  <td colSpan={6}>{sec.label}</td>
                </tr>
                {sec.rows.map((rowLabel) => {
                  const row = spSpecs.find((r) => r.label === rowLabel);
                  if (!row) return null;
                  const uniqueVals = [...new Set(row.vals.map((v) => v || row.vals.find((x) => x) || "—"))];
                  const allSame = uniqueVals.length <= 1 || row.vals.filter((v) => v).length === 1;
                  return (
                    <tr key={rowLabel}>
                      <td className="spec-label">{rowLabel}</td>
                      {allSame ? (
                        <td colSpan={5} className="spec-val spec-val--span">
                          {row.vals.find((v) => v) || "—"}
                        </td>
                      ) : (
                        spModels.map((_, i) => (
                          <td key={i} className="spec-val">
                            {getSpecVal(rowLabel, i)}
                          </td>
                        ))
                      )}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="cta-banner">
        <h2>Need a Three Phase Solution?</h2>
        <p>
          We also offer high-capacity three-phase inverters for larger residential, commercial, and
          industrial applications. Explore our TP-L and TP-H series for more power.
        </p>
        <Link className="btn-primary" href="/products/three-phase">
          View Three Phase Inverters
        </Link>
      </section>
    </main>
  );
}
