"use client";

import { useEffect, useState, useCallback } from "react";
import { apiMe, getAuthToken, clearAuthToken, type AuthUser } from "../../lib/api";
import {
  listComplaints,
  uploadComplaintInverterPicture,
  updateComplaintService,
  type Complaint,
  type DispatchAttachment,
} from "../../lib/imsApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type OnsiteFormData = {
  observationNotes: string;
  inverterPictures: DispatchAttachment[];
};

function makeEmptyForm(): OnsiteFormData {
  return { observationNotes: "", inverterPictures: [] };
}

export default function OnsitePage() {
  /* ── Auth ── */
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!getAuthToken()) { setBooting(false); return; }
    apiMe()
      .then(setUser)
      .catch(() => { clearAuthToken(); setUser(null); })
      .finally(() => setBooting(false));
  }, []);

  /* ── Tickets ── */
  const [tickets, setTickets] = useState<Complaint[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const res = await listComplaints({ type: "Consumer" });
      // Show only onsite tickets (siteVisitRequired === true)
      const onsite = res.data.filter((c) => c.siteVisitRequired === true);
      setTickets(onsite);
    } catch {
      // ignore
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user, fetchTickets]);

  /* ── Selected ticket ── */
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [form, setForm] = useState<OnsiteFormData>(makeEmptyForm);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationRemarks, setEscalationRemarks] = useState("");

  const selectTicket = (ticket: Complaint) => {
    setSelected(ticket);
    setForm({
      observationNotes: ticket.onsiteInspection?.observationNotes ?? "",
      inverterPictures: (ticket.onsiteInspection?.inverterPictures ?? []) as DispatchAttachment[],
    });
    setEscalationReason(ticket.replacementReason ?? "");
    setEscalationRemarks(ticket.replacementRemarks ?? "");
    setFormOk("");
    setFormError("");
  };

  /* ── Image Upload ── */
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (file: File | undefined) => {
    setUploadError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files can be uploaded.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image size must be under 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadComplaintInverterPicture(file);
      setForm((prev) => ({
        ...prev,
        inverterPictures: [...prev.inverterPictures, uploaded],
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removePicture = (url: string) => {
    setForm((prev) => ({
      ...prev,
      inverterPictures: prev.inverterPictures.filter((p) => p.url !== url),
    }));
  };

  /* ── Save ── */
  const [saving, setSaving] = useState(false);
  const [formOk, setFormOk] = useState("");
  const [formError, setFormError] = useState("");

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setFormOk("");
    setFormError("");
    try {
      await updateComplaintService(selected.id, {
        onsiteInspection: {
          ...(selected.onsiteInspection ?? {}),
          observationNotes: form.observationNotes,
          inverterPictures: form.inverterPictures,
        },
      });
      setFormOk("Onsite inspection saved successfully!");
      fetchTickets();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEscalate = async () => {
    if (!selected) return;
    const reason = escalationReason.trim();
    const remarks = escalationRemarks.trim();
    if (!reason) {
      setFormError("Please enter a replacement reason.");
      return;
    }

    setSaving(true);
    setFormOk("");
    setFormError("");
    try {
      await updateComplaintService(selected.id, {
        status: "Pending L3 Approval",
        l3SupportRequired: true,
        replacementRecommended: true,
        replacementReason: reason,
        replacementRemarks: remarks || undefined,
        replacementRequestImages: form.inverterPictures,
        replacementRequestedById: user?.id,
        replacementRequestedByName: user?.name || user?.email || "Engineer",
        replacementRequestedByRole: user?.role,
        trackingNotes: `Engineer escalated ticket to L3 for replacement review.${remarks ? ` Remarks: ${remarks}` : ""}`,
      });
      setFormOk("The ticket has been sent to the L3 approval queue.");
      fetchTickets();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Escalation failed.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading / Auth guard ── */
  if (booting) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={styles.lockIcon}>🔒</div>
          <h2 style={styles.cardTitle}>Login Required</h2>
          <p style={styles.cardSub}>Please sign in through the <a href="/admin" style={styles.link}>Admin Dashboard</a> first.</p>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.logoIcon}>🔧</div>
            <div>
              <h1 style={styles.headerTitle}>Onsite Inspection Form</h1>
              <p style={styles.headerSub}>Upload pictures &amp; add observation notes</p>
            </div>
          </div>
          <div style={styles.userBadge}>
            <span style={styles.userDot} />
            {user.name || user.email}
            <span style={styles.rolePill}>{user.role}</span>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* ── Left: Ticket List ── */}
        <section style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Onsite Tickets</h2>
            <button onClick={fetchTickets} disabled={loadingTickets} style={styles.refreshBtn}>
              {loadingTickets ? "⟳" : "↻"} Refresh
            </button>
          </div>

          {tickets.length === 0 && !loadingTickets && (
            <div style={styles.empty}>No onsite tickets are available.</div>
          )}

          <div style={styles.ticketList}>
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTicket(t)}
                style={{
                  ...styles.ticketCard,
                  ...(selected?.id === t.id ? styles.ticketCardActive : {}),
                }}
              >
                <div style={styles.ticketSerial}>{t.productSerialNo || "No Serial"}</div>
                <div style={styles.ticketMeta}>
                  {t.customerName || "Unknown Customer"} • {t.siteLocation || "No Location"}
                </div>
                <div style={styles.ticketIssue}>{t.issueDescription}</div>
                <div style={styles.ticketFooter}>
                  <span style={styles.statusBadge}>{t.status}</span>
                  {t.siteVisitScheduledDate && (
                    <span style={styles.dateBadge}>
                      📅 {new Date(t.siteVisitScheduledDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Right: Onsite Form ── */}
        <section style={styles.formArea}>
          {!selected ? (
            <div style={styles.placeholder}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <h3 style={styles.phTitle}>Select a Ticket</h3>
              <p style={styles.phSub}>Select an onsite ticket from the left panel to open the form.</p>
            </div>
          ) : (
            <div style={styles.formCard}>
              {/* Ticket Info Bar */}
              <div style={styles.ticketInfoBar}>
                <div>
                  <div style={styles.infoLabel}>Serial</div>
                  <div style={styles.infoValue}>{selected.productSerialNo || "—"}</div>
                </div>
                <div>
                  <div style={styles.infoLabel}>Customer</div>
                  <div style={styles.infoValue}>{selected.customerName || "—"}</div>
                </div>
                <div>
                  <div style={styles.infoLabel}>Location</div>
                  <div style={styles.infoValue}>{selected.siteLocation || "—"}</div>
                </div>
                <div>
                  <div style={styles.infoLabel}>Status</div>
                  <div style={styles.infoValue}><span style={styles.statusBadge}>{selected.status}</span></div>
                </div>
              </div>

              {/* ── Inverter Pictures ── */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h3 style={styles.sectionTitle}>📷 Inverter Pictures</h3>
                    <p style={styles.sectionSub}>Upload onsite inverter photos. Maximum 5 MB per image.</p>
                  </div>
                  <label style={{
                    ...styles.uploadBtn,
                    ...(uploading ? styles.uploadBtnDisabled : {}),
                  }}>
                    <span>{uploading ? "Uploading..." : "＋ Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        handleUpload(file);
                      }}
                    />
                  </label>
                </div>

                {uploadError && <div style={styles.errorMsg}>{uploadError}</div>}

                {form.inverterPictures.length > 0 ? (
                  <div style={styles.pictureGrid}>
                    {form.inverterPictures.map((pic) => (
                      <div key={pic.url} style={styles.pictureCard}>
                        <a href={pic.url} target="_blank" rel="noreferrer" style={styles.pictureLink}>
                          <img src={pic.url} alt={pic.fileName || "Inverter"} style={styles.pictureImg} />
                        </a>
                        <div style={styles.pictureFooter}>
                          <span style={styles.pictureName}>{pic.fileName || "Photo"}</span>
                          <button onClick={() => removePicture(pic.url)} style={styles.removeBtn}>
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyPictures}>
                    <span style={{ fontSize: 32 }}>🖼️</span>
                    <span>No pictures uploaded yet. Upload inverter photos above.</span>
                  </div>
                )}
              </div>

              {/* ── Observation Notes ── */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📝 Engineer Observation Notes</h3>
                <p style={styles.sectionSub}>Record your onsite visit observations here.</p>
                <textarea
                  rows={5}
                  value={form.observationNotes}
                  onChange={(e) => setForm((prev) => ({ ...prev, observationNotes: e.target.value }))}
                  placeholder="E.g. Inverter panel damage visible, wiring loose at DC side, grid voltage fluctuation observed..."
                  style={styles.textarea}
                />
              </div>

              {/* ── Save ── */}
              {formOk && <div style={styles.successMsg}>{formOk}</div>}
              {formError && <div style={styles.errorMsg}>{formError}</div>}

              <div style={styles.actionRow}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    ...styles.saveBtn,
                    ...(saving ? styles.saveBtnDisabled : {}),
                  }}
                >
                  {saving ? "Saving..." : "💾 Save Onsite Inspection"}
                </button>

                <div style={styles.escalationPanel}>
                  <h3 style={styles.sectionTitle}>⬆️ Escalate to L3</h3>
                  <p style={styles.sectionSub}>If a replacement is required, submit the request with the reason, remarks, and images.</p>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Replacement Reason</label>
                    <input
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      placeholder="E.g. Main board failure, inverter not repairable"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Remarks</label>
                    <textarea
                      rows={4}
                      value={escalationRemarks}
                      onChange={(e) => setEscalationRemarks(e.target.value)}
                      placeholder="Short notes for L3 approval"
                      style={styles.textarea}
                    />
                  </div>
                  <button
                    onClick={handleEscalate}
                    disabled={saving}
                    style={{
                      ...styles.escalateBtn,
                      ...(saving ? styles.saveBtnDisabled : {}),
                    }}
                  >
                    {saving ? "Submitting..." : "🚀 Escalate to L3"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1629",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid rgba(255,255,255,0.1)",
    borderTopColor: "#f59e0b",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "40px 32px",
    textAlign: "center" as const,
    maxWidth: 400,
  },
  lockIcon: { fontSize: 48, marginBottom: 16 },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 },
  cardSub: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  link: { color: "#f59e0b", textDecoration: "underline" },

  /* Page */
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  /* Header */
  header: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "0 24px",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.2,
  },
  headerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    margin: 0,
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: 500,
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },
  rolePill: {
    background: "rgba(245,158,11,0.15)",
    color: "#fbbf24",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },

  /* Main */
  main: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
  },

  /* Sidebar */
  sidebar: {
    width: 360,
    flexShrink: 0,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  refreshBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "4px 12px",
    fontSize: 12,
    color: "#64748b",
    cursor: "pointer",
    fontWeight: 500,
  },
  ticketList: {
    maxHeight: "calc(100vh - 180px)",
    overflowY: "auto" as const,
    padding: 8,
  },
  ticketCard: {
    display: "block",
    width: "100%",
    textAlign: "left" as const,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 8,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  ticketCardActive: {
    borderColor: "#f59e0b",
    background: "#fffbeb",
    boxShadow: "0 0 0 2px rgba(245,158,11,0.2)",
  },
  ticketSerial: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 4,
  },
  ticketMeta: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  ticketIssue: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
  },
  ticketFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  statusBadge: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  dateBadge: {
    fontSize: 11,
    color: "#64748b",
  },
  empty: {
    padding: 32,
    textAlign: "center" as const,
    color: "#94a3b8",
    fontSize: 14,
  },

  /* Form Area */
  formArea: {
    flex: 1,
    minWidth: 0,
  },
  placeholder: {
    background: "#fff",
    borderRadius: 16,
    border: "2px dashed #e2e8f0",
    padding: "80px 40px",
    textAlign: "center" as const,
  },
  phTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 8,
  },
  phSub: {
    fontSize: 14,
    color: "#94a3b8",
  },

  /* Form Card */
  formCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    padding: 24,
  },

  /* Ticket Info Bar */
  ticketInfoBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 16,
    padding: 16,
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    borderRadius: 12,
    marginBottom: 24,
    border: "1px solid #e2e8f0",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1e293b",
  },

  /* Sections */
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
    flexWrap: "wrap" as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  sectionSub: {
    fontSize: 13,
    color: "#94a3b8",
    margin: 0,
  },

  /* Upload */
  uploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 20px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  },
  uploadBtnDisabled: {
    opacity: 0.6,
    cursor: "wait",
  },

  /* Pictures */
  pictureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 12,
  },
  pictureCard: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    background: "#fff",
    transition: "box-shadow 0.2s",
  },
  pictureLink: {
    display: "block",
    aspectRatio: "4/3",
    background: "#f1f5f9",
  },
  pictureImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  pictureFooter: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  pictureName: {
    fontSize: 12,
    fontWeight: 600,
    color: "#3b82f6",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    flex: 1,
  },
  removeBtn: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  emptyPictures: {
    border: "2px dashed #e2e8f0",
    borderRadius: 12,
    padding: "32px 16px",
    textAlign: "center" as const,
    color: "#94a3b8",
    fontSize: 13,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
  },

  /* Textarea */
  textarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 1.6,
    resize: "vertical" as const,
    outline: "none",
    marginTop: 12,
    fontFamily: "inherit",
    background: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 16,
    alignItems: "start",
  },
  escalationPanel: {
    border: "1px solid #fdba74",
    borderRadius: 12,
    background: "#fff7ed",
    padding: 16,
  },
  fieldGroup: {
    marginTop: 12,
  },
  fieldLabel: {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #fdba74",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    background: "#fff",
    fontFamily: "inherit",
  },
  escalateBtn: {
    width: "100%",
    marginTop: 12,
    padding: "14px 20px",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.02em",
  },

  /* Messages */
  successMsg: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
  errorMsg: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },

  /* Save Button */
  saveBtn: {
    width: "100%",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.02em",
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: "wait",
  },
};
