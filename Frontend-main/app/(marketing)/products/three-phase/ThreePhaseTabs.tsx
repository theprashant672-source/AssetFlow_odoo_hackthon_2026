"use client";

import Image from "next/image";
import { useState } from "react";

import SectionHeading from "../../components/SectionHeading";
import { CheckIcon, ShieldIcon, StarIcon, WarnIcon } from "../../components/icons";

type SpecRow = { label: string; vals: string[] };
type SpecSection = { label: string; rows: string[] };

export default function ThreePhaseTabs() {
  const [activeTab, setActiveTab] = useState<"tpl" | "tph">("tpl");

  const seriesImageSrc = "/TP-L.svg";
  const seriesAlt = "NovaAssets TP-L Series inverter";

  const tplModels = ["8kW", "10kW", "12kW"];
  const tphModels = ["15kW", "20kW", "25kW", "30kW", "40kW", "50kW"];

  const tplSections: SpecSection[] = [
    {
      label: "Battery Data",
      rows: [
        "Battery Type",
        "Rated Battery Voltage (Vdc)",
        "Battery Voltage Range (Vdc)",
        "Max. Charge/Discharge Current (A)",
      ],
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
      rows: [
        "Rated Output Power (W)",
        "Rated Output Current (A)",
        "Rated Output Frequency (Hz)",
        "Overload Capability",
        "Switch Time (ms)",
        "Total Harmonic Distortion (THDV)",
      ],
    },
    {
      label: "Efficiency",
      rows: ["Max. Efficiency", "Euro Efficiency", "MPPT Efficiency"],
    },
    {
      label: "Protection",
      rows: ["Integrated", "Surge Protection", "Over Voltage Category", "AFCI"],
    },
    {
      label: "General Data",
      rows: [
        "Operating Temperature (°C)",
        "Dimensions [W*H*D] (mm)",
        "Weight (kg)",
        "Topology",
        "Cooling",
        "Altitude (m)",
        "Protection Level",
        "Communication",
        "Warranty",
        "Max. No. of Parallel Units",
      ],
    },
    {
      label: "Standards",
      rows: ["Grid Standards", "Safety Standards", "EMC Standards"],
    },
  ];

  const tplSpecs: SpecRow[] = [
    { label: "Battery Type", vals: ["Lithium-ion & Lead-acid", "", ""] },
    { label: "Rated Battery Voltage (Vdc)", vals: ["400", "", ""] },
    { label: "Battery Voltage Range (Vdc)", vals: ["135-800", "", ""] },
    { label: "Max. Charge/Discharge Current (A)", vals: ["33/33", "", ""] },

    { label: "Max. Input Power (W)", vals: ["12000", "15000", "18000"] },
    { label: "Max. Input Voltage (Vdc)", vals: ["1000", "", ""] },
    { label: "Rated Input Voltage (Vdc)", vals: ["600", "", ""] },
    { label: "Start-Up Voltage (Vdc)", vals: ["120", "", ""] },
    { label: "MPPT Voltage Range (Vdc)", vals: ["180-900", "", ""] },
    { label: "No. of MPPT/Strings Per MPPT", vals: ["2/1+1", "", ""] },
    { label: "Max. Input Current Per MPPT (A)", vals: ["16/16", "", ""] },
    { label: "Max. Short Circuit Current Per MPPT (A)", vals: ["20/20", "", ""] },

    { label: "Rated Grid Voltage (Vac)", vals: ["3L/N/PE, 400", "", ""] },
    { label: "Rated Grid Frequency (Hz)", vals: ["50", "", ""] },
    { label: "Rated Grid-Tied Power (W)", vals: ["8000", "10000", "12000"] },
    { label: "Rated Grid-Tied Current (A)", vals: ["11.6", "14.5", "17.4"] },
    { label: "Max Grid-Tied Apparent Power (VA)", vals: ["8800", "11000", "13200"] },
    { label: "Max Grid-Tied Current (A)", vals: ["13.4", "16.7", "20"] },
    { label: "Max Input Apparent Power (VA)", vals: ["8800", "11000", "13200"] },
    { label: "Max Input Current (A)", vals: ["13.4", "16.7", "20"] },
    { label: "Total Harmonic Distortion (THDI)", vals: ["3%", "", ""] },
    { label: "Displacement Power Factor", vals: ["0.8 leading to 0.8 lagging", "", ""] },

    { label: "Rated Output Power (W)", vals: ["8000", "10000", "12000"] },
    { label: "Rated Output Current (A)", vals: ["11.6", "14.5", "17.4"] },
    { label: "Rated Output Frequency (Hz)", vals: ["50", "", ""] },
    { label: "Overload Capability", vals: ["110%, continuous, 150%, 10s", "", ""] },
    { label: "Switch Time (ms)", vals: ["<10", "", ""] },
    { label: "Total Harmonic Distortion (THDV)", vals: ["3%", "", ""] },

    { label: "Max. Efficiency", vals: ["97.80%", "98.00%", "98.40%"] },
    { label: "Euro Efficiency", vals: ["97.10%", "97.30%", "97.30%"] },
    { label: "MPPT Efficiency", vals: ["99.90%", "", ""] },

    {
      label: "Integrated",
      vals: [
        "PV Reverse-polarity Protection, PV Insulation Detection, Ground Fault Monitoring, Over Current Protection, Over Voltage Protection, Leakage protection",
        "",
        "",
      ],
    },
    { label: "Surge Protection", vals: ["DC type II/AC type II", "", ""] },
    { label: "Over Voltage Category", vals: ["DC type II/AC type III", "", ""] },
    { label: "AFCI", vals: ["Optional", "", ""] },

    { label: "Operating Temperature (°C)", vals: ["-25 to +60 (Above 45°C Derating)", "", ""] },
    { label: "Dimensions [W*H*D] (mm)", vals: ["565x465x197", "", ""] },
    { label: "Weight (kg)", vals: ["31", "", ""] },
    { label: "Topology", vals: ["Transformerless", "", ""] },
    { label: "Cooling", vals: ["Natural Cooling", "", ""] },
    { label: "Altitude (m)", vals: ["<3000", "", ""] },
    { label: "Protection Level", vals: ["IP66", "", ""] },
    { label: "Communication", vals: ["RS485, WiFi/GPRS, CAN2.0", "", ""] },
    { label: "Warranty", vals: ["8 Years (Standard) / 10 Years (Optional)", "", ""] },
    { label: "Max. No. of Parallel Units", vals: ["6", "", ""] },

    {
      label: "Grid Standards",
      vals: ["VDE-AR-N 4105, VDE0126-1-1, EN50549, CEI 0-21/16, EIFS, PSG, TOR", "", ""],
    },
    { label: "Safety Standards", vals: ["IEC/EN 62109-1, IEC/EN 62109-2", "", ""] },
    {
      label: "EMC Standards",
      vals: [
        "EN IEC 61000-6-1:2019, EN IEC 61000-6-3:2021, EN 61000-3-12:2011, EN IEC 61000-3-11:2019",
        "",
        "",
      ],
    },
  ];

  const tphSections: SpecSection[] = [
    { label: "Battery Data", rows: ["Battery Type", "Battery Voltage Range (Vdc)"] },
    { label: "PV Input", rows: ["Max. Input Power (W)", "Max. Input Voltage (Vdc)", "MPPT Voltage Range (Vdc)", "No. of MPPT"] },
    { label: "Grid Input & Output", rows: ["Rated Grid Voltage (Vac)", "Rated Grid Frequency (Hz)"] },
    { label: "General Data", rows: ["Max. Efficiency", "MPPT Efficiency", "Protection Level", "Warranty", "Topology", "Communication"] },
  ];

  const tphSpecs: SpecRow[] = [
    { label: "Battery Type", vals: ["Lithium-ion & Lead-acid", "", "", "", "", ""] },
    { label: "Battery Voltage Range (Vdc)", vals: ["40-60", "", "", "", "", ""] },
    { label: "Max. Input Power (W)", vals: ["20000", "27000", "33750", "40500", "54000", "67500"] },
    { label: "Max. Input Voltage (Vdc)", vals: ["800", "", "", "", "", ""] },
    { label: "MPPT Voltage Range (Vdc)", vals: ["200-750", "", "", "", "", ""] },
    { label: "No. of MPPT", vals: ["2", "", "", "", "", ""] },
    { label: "Rated Grid Voltage (Vac)", vals: ["3L/N/PE, 400V ±15%", "", "", "", "", ""] },
    { label: "Rated Grid Frequency (Hz)", vals: ["50/60", "", "", "", "", ""] },
    { label: "Max. Efficiency", vals: ["98.6%", "", "", "", "", ""] },
    { label: "MPPT Efficiency", vals: ["99.9%", "", "", "", "", ""] },
    { label: "Protection Level", vals: ["IP66", "", "", "", "", ""] },
    { label: "Warranty", vals: ["8 Years (Standard) / 10 Years (Optional)", "", "", "", "", ""] },
    { label: "Topology", vals: ["Non-Isolated", "", "", "", "", ""] },
    { label: "Communication", vals: ["RS485/WiFi/CAN/4G (Optional)", "", "", "", "", ""] },
  ];

  const activeSpecs = activeTab === "tpl" ? tplSpecs : tphSpecs;
  const activeModels = activeTab === "tpl" ? tplModels : tphModels;
  const activeSections = activeTab === "tpl" ? tplSections : tphSections;

  return (
    <main>
      <div className="page-hero">
        <SectionHeading title="Products" sub="Three Phase Inverters" />
      </div>

      <section className="section product-intro">
        <div className="product-intro-grid">
          <div>
            <div className="tab-toggle">
              <button
                className={`tab-btn ${activeTab === "tpl" ? "tab-btn--active" : ""}`}
                type="button"
                onClick={() => setActiveTab("tpl")}
              >
                TP-L Series (8-12kW)
              </button>
              <button
                className={`tab-btn ${activeTab === "tph" ? "tab-btn--active" : ""}`}
                type="button"
                onClick={() => setActiveTab("tph")}
              >
                TP-H Series (15-50kW)
              </button>
            </div>
            <h2 className="product-series-title">
              {activeTab === "tpl" ? "NovaAssets TP-L SERIES" : "NovaAssets TP-H SERIES"}
            </h2>
            <p className="product-series-sub">
              {activeTab === "tpl"
                ? "AW-TP-L 8kW to 12kW Three Phase Series"
                : "AW-TP-H 15kW to 50kW Three Phase Series"}
            </p>
            <ul className="about-list">
              <li>
                <ShieldIcon />
                <div>
                  <strong>Warranty 8 / 10 Years*</strong>
                </div>
              </li>
              <li>
                <CheckIcon />
                <div>
                  <strong>Fanless | Silent Design</strong> — Cool operation without moving parts.
                </div>
              </li>
              <li>
                <StarIcon />
                <div>
                  <strong>99.9% | MPPTs Efficiency</strong> — Maximum energy harvest.
                </div>
              </li>
              <li>
                <WarnIcon />
                <div>
                  <strong>150% | Overload Tolerance</strong> — Handles surge loads reliably.
                </div>
              </li>
              <li>
                <ShieldIcon />
                <div>
                  <strong>{activeTab === "tpl" ? "IP65" : "IP66"} Rating Design</strong> — Built for
                  outdoor durability.
                </div>
              </li>
            </ul>
          </div>
          <div className="product-image">
            <div className="product-photo product-photo--large">
              <Image
                src={seriesImageSrc}
                alt={seriesAlt}
                fill
                unoptimized
                sizes="(max-width: 900px) 92vw, 620px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          title="Technical Specifications"
          sub={
            activeTab === "tpl"
              ? "NovaAssets TP-L SERIES (8kW - 12kW)"
              : "NovaAssets TP-H SERIES (15kW - 50kW)"
          }
        />
        <div className="spec-table-wrapper">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Model</th>
                {activeModels.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            {activeSections.map((sec) => (
              <tbody key={sec.label}>
                <tr className="spec-section-row">
                  <td colSpan={activeModels.length + 1}>{sec.label}</td>
                </tr>
                {sec.rows.map((rowLabel) => {
                  const row = activeSpecs.find((r) => r.label === rowLabel);
                  if (!row) return null;
                  const uniqueVals = [
                    ...new Set(row.vals.map((v) => v || row.vals.find((x) => x) || "—")),
                  ];
                  const allSame = uniqueVals.length <= 1 || row.vals.filter((v) => v).length === 1;

                  return (
                    <tr key={rowLabel}>
                      <td className="spec-label">{rowLabel}</td>
                      {allSame ? (
                        <td colSpan={activeModels.length} className="spec-val spec-val--span">
                          {row.vals.find((v) => v) || "—"}
                        </td>
                      ) : (
                        activeModels.map((_, i) => (
                          <td key={i} className="spec-val">
                            {row.vals[i] || row.vals.find((v) => v) || "—"}
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
    </main>
  );
}
