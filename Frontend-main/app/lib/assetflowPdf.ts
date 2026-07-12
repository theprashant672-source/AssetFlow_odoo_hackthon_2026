import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const BRAND = "#5b3df5";
const INK = "#0f172a";

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(INK);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 26, "F");
  doc.setTextColor("#ffffff");
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("AssetFlow", 14, 11);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 19);
  doc.setTextColor("#94a3b8");
  doc.setFontSize(8);
  doc.text(subtitle, doc.internal.pageSize.getWidth() - 14, 19, { align: "right" });
  doc.setTextColor(INK);
}

function generatedStamp(): string {
  return `Generated ${new Date().toLocaleString()}`;
}

type AssetRow = {
  tag: string;
  name: string;
  categoryName?: string;
  departmentName?: string;
  location?: string;
  status?: string;
  condition?: string;
  id: string;
};

export function exportAssetReportPdf(assets: AssetRow[]) {
  const doc = new jsPDF();
  addHeader(doc, "Asset Inventory Report", generatedStamp());

  autoTable(doc, {
    startY: 32,
    head: [["Tag", "Name", "Category", "Department", "Location", "Status", "Condition"]],
    body: assets.map((a) => [
      a.tag,
      a.name,
      a.categoryName || "—",
      a.departmentName || "—",
      a.location || "—",
      a.status || "—",
      a.condition || "—",
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: BRAND, fontSize: 8.5 },
    alternateRowStyles: { fillColor: "#f8fafc" },
  });

  doc.save(`assetflow-inventory-${new Date().toISOString().slice(0, 10)}.pdf`);
}

type MaintenanceRow = {
  id: string;
  assetName: string;
  requestedBy: string;
  issueDescription: string;
  priority: string;
  status: string;
  createdAt?: string;
  resolutionNotes?: string;
};

export function exportMaintenanceReportPdf(requests: MaintenanceRow[]) {
  const doc = new jsPDF();
  addHeader(doc, "Maintenance & Repairs Report", generatedStamp());

  autoTable(doc, {
    startY: 32,
    head: [["Asset", "Requested By", "Issue", "Priority", "Status", "Raised On"]],
    body: requests.map((r) => [
      r.assetName,
      r.requestedBy,
      r.issueDescription,
      r.priority,
      r.status,
      r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: BRAND, fontSize: 8.5 },
    alternateRowStyles: { fillColor: "#f8fafc" },
    columnStyles: { 2: { cellWidth: 60 } },
  });

  doc.save(`assetflow-maintenance-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportMaintenanceTicketPdf(req: MaintenanceRow) {
  const doc = new jsPDF();
  addHeader(doc, "Maintenance Ticket", generatedStamp());

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(req.assetName, 14, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#64748b");
  doc.text(`Ticket ID: ${req.id}`, 14, 49);
  doc.setTextColor(INK);

  autoTable(doc, {
    startY: 56,
    theme: "plain",
    body: [
      ["Requested by", req.requestedBy],
      ["Priority", req.priority],
      ["Status", req.status],
      ["Raised on", req.createdAt ? new Date(req.createdAt).toLocaleString() : "—"],
      ["Issue", req.issueDescription],
      ["Resolution", req.resolutionNotes || "—"],
    ],
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: "#475569" },
    },
  });

  doc.save(`ticket-${req.id.slice(0, 8)}.pdf`);
}

export async function exportQrLabelsPdf(assets: AssetRow[], baseUrl: string) {
  const doc = new jsPDF();
  addHeader(doc, "Asset QR Labels", generatedStamp());

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const cols = 3;
  const cellW = (pageWidth - 28) / cols;
  const cellH = 62;
  const qrSize = 34;
  let x = 14;
  let y = 34;
  let col = 0;

  for (const asset of assets) {
    if (y + cellH > pageHeight - 10) {
      doc.addPage();
      y = 14;
      x = 14;
      col = 0;
    }

    const dataUrl = await QRCode.toDataURL(`${baseUrl}/asset/${asset.id}`, {
      width: 256,
      margin: 1,
      color: { dark: INK, light: "#ffffff" },
    });

    doc.setDrawColor("#cbd5e1");
    doc.roundedRect(x, y, cellW - 4, cellH - 4, 2, 2);
    doc.addImage(dataUrl, "PNG", x + (cellW - 4 - qrSize) / 2, y + 4, qrSize, qrSize);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(asset.tag, x + (cellW - 4) / 2, y + qrSize + 11, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#64748b");
    const name = asset.name.length > 30 ? `${asset.name.slice(0, 28)}…` : asset.name;
    doc.text(name, x + (cellW - 4) / 2, y + qrSize + 16, { align: "center" });
    doc.setTextColor(INK);

    col += 1;
    if (col >= cols) {
      col = 0;
      x = 14;
      y += cellH;
    } else {
      x += cellW;
    }
  }

  doc.save(`assetflow-qr-labels-${new Date().toISOString().slice(0, 10)}.pdf`);
}
