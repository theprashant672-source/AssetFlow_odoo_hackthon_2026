import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import customersRouter from "./routes/customers";
import productsRouter from "./routes/products";
import priceEntriesRouter from "./routes/priceEntries";
import rawMaterialsRouter from "./routes/rawMaterials";
import inwardsRouter from "./routes/inwards";
import manufacturedRouter from "./routes/manufactured";
import serialsRouter from "./routes/serials";
import salesRouter from "./routes/sales";
import complaintsRouter from "./routes/complaints";
import customerPortalRouter from "./routes/customerPortal";
import distributorsRouter from "./routes/distributors";
import bomsRouter from "./routes/boms";
import dashboardRouter from "./routes/dashboard";
import notificationsRouter from "./routes/notifications";
import rolesRouter from "./routes/roles";
import engineerAssignmentsRouter from "./routes/engineerAssignments";
import geoRouter from "./routes/geo";
import organizationRouter from "./routes/organization";
import assetsRouter from "./routes/assets";
import bookingsRouter from "./routes/bookings";
import maintenanceRouter from "./routes/maintenance";
import auditRouter from "./routes/audit";
import reportsRouter from "./routes/reports";

const app = express();

function createCorsOptions() {
  const allowedOrigins = [
    "https://aurawatt.in",
    "https://www.aurawatt.in",
    "https://frontend-six-alpha-iyg19kf2uq.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(process.env.CORS_ORIGIN ?? "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  ];
  const allowedOriginSet = new Set(allowedOrigins);

  return {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!requestOrigin) return callback(null, true);
      return callback(null, allowedOriginSet.has(requestOrigin.replace(/\/+$/, "")));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    optionsSuccessStatus: 204,
  };
}

app.use(helmet());
const corsOptions = createCorsOptions();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "NovaAssets IMS API" });
});

app.get("/", (_req, res) => {
  res.json({
    service: "NovaAssets IMS API",
    status: "ok",
    health: "/health",
    apiBase: "/api",
  });
});

app.get(["/favicon.ico", "/favicon.png"], (_req, res) => res.status(204).end());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/price-entries", priceEntriesRouter);
app.use("/api/raw-materials", rawMaterialsRouter);
app.use("/api/inwards", inwardsRouter);
app.use("/api/manufactured", manufacturedRouter);
app.use("/api/serials", serialsRouter);
app.use("/api/sales", salesRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/customer-portal", customerPortalRouter);
app.use("/api/distributors", distributorsRouter);
app.use("/api/boms", bomsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/engineer-assignments", engineerAssignmentsRouter);
app.use("/api/geo", geoRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/audit", auditRouter);
app.use("/api/reports", reportsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: (req as any).originalUrl || req.url,
    method: req.method,
  });
});

app.use(errorHandler);

export default app;
