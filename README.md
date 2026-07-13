# AssetFlow — Asset & Resource Management

Built for **Odoo Hackathon 2026**.

AssetFlow is a workspace where a company can track every asset it owns — laptops, meeting rooms, vehicles, equipment — who is holding what, what needs repair, and what it's all costing. One login, and each role sees only the screens that matter to them.

**Backend API:** https://asset-flow-odoo-hackthon-2026.vercel.app

---

## What it does

- **Asset register** — add assets with tag, category, department and location. Full lifecycle: Available → Allocated → Under Maintenance → Retired.
- **QR code tracking** — every asset gets a QR code. Print the label, stick it on the device. Anyone can scan it with a normal phone camera and the asset's "passport" page opens with its details and repair history. There's also an in-app scanner at `/scan`.
- **Allocation & booking** — assign assets to people, or book shared resources (meeting rooms, projectors, vehicles) in time slots. Overlapping bookings get rejected automatically.
- **Maintenance workflow** — raise an issue, get it approved, assign a technician, resolve it. While you type the issue description, the app suggests a priority and category for it (with a confidence score), and you can apply the suggestion with one click.
- **Predictive alerts** — assets that keep breaking get flagged with a risk score, so you know when repairing stops making sense and replacement is due.
- **Analytics** — portfolio value, utilization rate, repair spend per month, resolution time by priority, all as charts. Not a wall of numbers.
- **Real-time notifications** — register an asset or raise a repair in one tab, every other open session gets a live toast instantly (Server-Sent Events, no polling).
- **PDF exports** — asset inventory report, maintenance report, individual tickets, and printable QR label sheets.
- **Audit cycles** — plan a verification round, mark each asset Verified / Missing / Damaged, and get a discrepancy report at the end.

## Roles

Six roles, each with its own sidebar and permissions. Use the quick sign-in cards on the login page — password for all demo accounts is `ODOO@123`.

| Role | Login | What they see |
|------|-------|---------------|
| Founder | superadmin@odoo.com | Everything — org setup, roles, reports, analytics |
| Admin | admin@odoo.com | Departments, categories, employee directory |
| Manager | manager@odoo.com | Asset register, allocation approvals, transfers |
| TL (Team Lead) | tl@odoo.com | Department assets and team requests |
| IT Service | itservice@odoo.com | Maintenance queue, triage to resolution |
| Employee | employee@odoo.com | My assets, bookings, raise an issue, profile |

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, jsPDF, qrcode + jsQR
- **Backend:** Node.js, Express 5, MongoDB, JWT auth, Server-Sent Events
- **Deployed on:** Vercel (both apps, from this one repo)

## Running it locally

You need Node 18+ and a MongoDB connection string (Atlas free tier works fine).

**Backend**

```bash
cd Backend-main
npm install
# set DATABASE_URL to your MongoDB connection string, then:
npm run dev
# API runs at http://localhost:5000 — check http://localhost:5000/health
```

**Frontend**

```bash
cd Frontend-main
npm install
npm run dev
# open http://localhost:3000
```

The frontend talks to `http://localhost:5000` by default in dev. To point it somewhere else, set `NEXT_PUBLIC_API_BASE_URL` before building.

One thing worth knowing: the workspace also ships with an in-browser demo dataset, so screens like analytics and AI insights still render sensibly even if the backend isn't running. Handy for a quick look around.

## Repo layout

```
Backend-main/    Express + MongoDB API (routes, services, seed scripts)
Frontend-main/   Next.js app (marketing site, login, role workspaces)
```

Interesting bits if you're reading the code:

- `Backend-main/src/services/aiInsights.ts` — the triage and risk-scoring logic
- `Backend-main/src/services/realtime.ts` — the SSE hub
- `Frontend-main/app/asset/[id]/page.tsx` — the public page a QR scan lands on
- `Frontend-main/app/lib/assetflowPdf.ts` — all the PDF generation

## Quick demo path

1. Sign in as Founder (`superadmin@odoo.com` / `ODOO@123`)
2. Assets → click **QR** on any row → print the label → scan it with your phone
3. Maintenance → raise a request and type something like "screen cracked, won't turn on, urgent" → watch the priority suggestion appear
4. Open a second tab, register an asset there, and see the live notification pop in the first tab
5. Analytics → charts plus the predictive maintenance panel
