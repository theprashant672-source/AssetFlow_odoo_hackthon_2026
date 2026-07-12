"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  customerPortalLogin,
  raiseCustomerComplaint,
  type CustomerPortalLoginResponse,
  type CustomerComplaintResponse,
} from "../lib/customerPortalApi";
import { getIndiaDistricts, getIndiaStates } from "../lib/imsApi";
import { SearchableSelect } from "../components/shared/SearchableSelect";

type Step = "login" | "complaint" | "done";

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SupportClient() {
  const searchParams = useSearchParams();
  const initialSerial = useMemo(() => searchParams.get("serial") ?? searchParams.get("sn") ?? "", [searchParams]);
  const pictureInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>("login");
  const [serialNumber, setSerialNumber] = useState(initialSerial);
  const [mobile, setMobile] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [session, setSession] = useState<CustomerPortalLoginResponse | null>(null);
  const [ticket, setTicket] = useState<CustomerComplaintResponse | null>(null);
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const productLabel = session?.session.productName || session?.session.productModel || session?.product?.name || session?.product?.model || session?.session.productId || "Product";

  useEffect(() => {
    let cancelled = false;
    setGeoLoading(true);
    setGeoError("");
    getIndiaStates()
      .then((data) => {
        if (cancelled) return;
        setStateOptions(data.states ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setGeoError(err instanceof Error ? err.message : "Unable to load state options.");
        setStateOptions([]);
      })
      .finally(() => {
        if (cancelled) return;
        setGeoLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!state) {
      setDistrictOptions([]);
      setDistrictLoading(false);
      return;
    }

    setDistrictLoading(true);
    setGeoError("");
    getIndiaDistricts(state)
      .then((data) => {
        if (cancelled) return;
        setDistrictOptions(data.districts ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setGeoError(err instanceof Error ? err.message : "Unable to load district options.");
        setDistrictOptions([]);
      })
      .finally(() => {
        if (cancelled) return;
        setDistrictLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  useEffect(() => {
    if (district && !districtOptions.includes(district)) {
      setDistrict("");
    }
  }, [district, districtOptions]);

  const handleLogin = async () => {
    setMessage("");
    const serial = serialNumber.trim();
    const phone = mobile.trim();
    if (!phone) {
      setMessage("Please enter mobile number.");
      return;
    }

    setLoading(true);
    try {
      const data = await customerPortalLogin({ serialNumber: serial || undefined, mobile: phone });
      setSession(data);
      setStep("complaint");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to verify details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async () => {
    setMessage("");
    if (session?.activeComplaint) {
      return;
    }
    const description = issueDescription.trim();
    if (!description) {
      setMessage("Please describe the issue so our service team can help quickly.");
      return;
    }
    if (!customerName.trim()) {
      setMessage("Please enter customer name.");
      return;
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!state.trim() || !district.trim()) {
      setMessage("Please select state and district.");
      return;
    }

    setLoading(true);
    try {
      const data = await raiseCustomerComplaint({
        serialNumber: serialNumber.trim() || undefined,
        mobile: mobile.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        state: state.trim(),
        district: district.trim(),
        issueDescription: description,
        picture: pictureFile,
      });
      setTicket(data);
      setStep("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to raise complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#101828] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white">
              <Image src="/novaassets_logo.webp" alt="NovaAssets" fill sizes="44px" className="object-cover object-left" />
            </span>
            <span>
              <span className="block text-sm font-black tracking-[0.3em] text-amber-300">NovaAssets</span>
              <span className="block text-xs text-white/60">Customer Support</span>
            </span>
          </Link>
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">
            Home
          </Link>
        </header>

        <section className="grid flex-1 grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              QR / Link Based Complaint
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Raise inverter complaint from mobile.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              Customer ya dealer QR code scan karke isi page par aayega. Serial number verify hoga, aur isi ticket ke liye diya gaya contact mobile service team ko milega.
            </p>
            <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {["Scan QR / open link", "Verify serial", "Service team notified"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-sm font-black text-[#101828]">
                    {index + 1}
                  </div>
                  <div className="text-sm font-semibold text-white/85">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-gray-900 shadow-2xl sm:p-7">
            {step === "login" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-black">Customer Login</h2>
                  <p className="mt-1 text-sm text-gray-500">Enter mobile number to continue. Serial number is optional.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Inverter Serial Number (Optional)</label>
                    <input
                      value={serialNumber}
                      onChange={(event) => setSerialNumber(event.target.value)}
                      placeholder="Example: AWSP123456"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-mono text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                    <div className="mt-1 text-xs text-gray-400">Optional. You can also continue with mobile number only.</div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-amber-300/70 bg-amber-50/60 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Optional Photo Upload</div>
                        <div className="mt-1 text-sm text-gray-600">If serial number is not available, upload the inverter label photo here.</div>
                      </div>
                      <input
                        ref={pictureInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => setPictureFile(event.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => pictureInputRef.current?.click()}
                        className="rounded-2xl border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50"
                      >
                        {pictureFile ? "Change Photo" : "Upload Photo"}
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-gray-500">Selected:</span>
                      <span className="font-semibold text-gray-800">{pictureFile?.name || "No photo selected"}</span>
                      {pictureFile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPictureFile(null);
                            if (pictureInputRef.current) pictureInputRef.current.value = "";
                          }}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Mobile Number</label>
                    <input
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value)}
                      inputMode="tel"
                      placeholder="Contact mobile"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                </div>
                {message && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-200 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </div>
            )}

            {step === "complaint" && (
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">Raise Complaint</h2>
                    <p className="mt-1 text-sm text-gray-500">Date: {todayLabel()} • Source: Link</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Verified</span>
                </div>
                <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-gray-400">Serial (Optional)</div>
                    <div className="font-mono font-bold text-gray-800">{serialNumber.trim() || "Not provided"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Product</div>
                    <div className="font-semibold text-gray-800">{productLabel || "—"}</div>
                  </div>
                </div>
                {session?.activeComplaint ? (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {session.activeComplaint.message}
                  </div>
                ) : null}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Name</label>
                    <input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email Address (Optional)</label>
                    <input
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      inputMode="email"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">State</label>
                    <SearchableSelect
                      label="State"
                      value={state}
                      onChange={(next) => {
                        setState(next);
                        setDistrict("");
                      }}
                      options={stateOptions.map((option) => ({ value: option, label: option }))}
                      placeholder={geoLoading ? "Loading states…" : "Select state"}
                      loading={geoLoading}
                      error={geoError}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">District</label>
                    <SearchableSelect
                      label="District"
                      value={district}
                      onChange={setDistrict}
                      options={districtOptions.map((option) => ({ value: option, label: option }))}
                      placeholder={state ? "Select district" : "Select state first"}
                      loading={geoLoading || districtLoading || (Boolean(state) && districtOptions.length === 0)}
                      disabled={!state}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Issue Description</label>
                  <textarea
                    value={issueDescription}
                    onChange={(event) => setIssueDescription(event.target.value)}
                    rows={5}
                    placeholder="Example: Inverter showing error code, no generation, WiFi issue, display issue..."
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </div>
                {message && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitComplaint}
                    disabled={loading || Boolean(session?.activeComplaint)}
                    className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-amber-200 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-60"
                  >
                    {session?.activeComplaint ? "Active Complaint Exists" : loading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
                <h2 className="text-2xl font-black">Complaint Registered</h2>
                <p className="mt-2 text-sm text-gray-500">Your complaint request has been sent to NovaAssets Admin/Sales team.</p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Ticket ID</span>
                    <span className="font-mono font-bold text-gray-900">{ticket?.id}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4">
                    <span className="text-gray-500">Status</span>
                    <span className="font-bold text-amber-700">{ticket?.status}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("login");
                    setIssueDescription("");
                    setTicket(null);
                    setSession(null);
                    setState("");
                    setDistrict("");
                    setPictureFile(null);
                    setMessage("");
                  }}
                  className="mt-6 rounded-2xl bg-[#101828] px-6 py-3 text-sm font-black text-white hover:bg-[#1d2939]"
                >
                  Raise Another Complaint
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
