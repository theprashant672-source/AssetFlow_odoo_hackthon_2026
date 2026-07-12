import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

import { CONFIG } from "../config";

let clientPromise: Promise<MongoClient> | null = null;
let dbPromise: Promise<Db> | null = null;

function stripUnsupportedTlsQueryParams(uri: string): string {
  try {
    const parsed = new URL(uri);

    const uniqueKeys = Array.from(new Set(parsed.searchParams.keys()));
    const nextParams = new URLSearchParams();

    for (const key of uniqueKeys) {
      const k = key.toLowerCase();
      const values = parsed.searchParams.getAll(key);

      if (k === "maxversion" || k === "minversion") continue;

      if (k === "readpreferencetags") {
        for (const v of values) nextParams.append(key, v);
        continue;
      }

      for (const v of values) {
        if (v === "") continue;
        nextParams.append(key, v);
      }
    }

    parsed.search = nextParams.toString();
    return parsed.toString();
  } catch {
    return uri;
  }
}

function looksLikeTlsInternalError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("tlsv1 alert internal error") || msg.includes("SSL alert number 80");
}

function dbNameFromUrl(url: URL): string | null {
  const pathname = url.pathname || "";
  const name = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return name ? decodeURIComponent(name) : null;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = stripUnsupportedTlsQueryParams(CONFIG.DATABASE_URL);
  if (!uri) {
    throw new Error("DATABASE_URL/MONGODB_URI is not set");
  }

  const baseOptions: MongoClientOptions = {
    serverSelectionTimeoutMS: CONFIG.DB_CONNECT_TIMEOUT_MS,
  };

  const envTlsOptions: MongoClientOptions = {
    ...(CONFIG.MONGODB_TLS_SECURE_PROTOCOL ? { secureProtocol: CONFIG.MONGODB_TLS_SECURE_PROTOCOL } : null),
    ...(CONFIG.MONGODB_TLS_INSECURE ? { tlsInsecure: true } : null),
    ...(CONFIG.MONGODB_TLS_ALLOW_INVALID_CERTS ? { tlsAllowInvalidCertificates: true } : null),
    ...(CONFIG.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES ? { tlsAllowInvalidHostnames: true } : null),
    ...(CONFIG.MONGODB_TLS_CA_FILE ? { tlsCAFile: CONFIG.MONGODB_TLS_CA_FILE } : null),
  };

  clientPromise = (async () => {
    try {
      const client = new MongoClient(uri, { ...baseOptions, ...envTlsOptions });
      await client.connect();
      return client;
    } catch (err) {
      if (!CONFIG.MONGODB_TLS_SECURE_PROTOCOL && looksLikeTlsInternalError(err)) {
        const client = new MongoClient(uri, { ...baseOptions, secureProtocol: "TLSv1_2_method" });
        await client.connect();
        return client;
      }
      throw err;
    }
  })().catch((err) => {
    clientPromise = null;
    dbPromise = null;
    throw err;
  });

  return clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const uri = CONFIG.DATABASE_URL;
    const client = await getMongoClient();

    let name = "novaassets_ims";
    try {
      const parsed = new URL(uri);
      name = dbNameFromUrl(parsed) || name;
    } catch {
    }

    if (CONFIG.MONGODB_DB_NAME) name = CONFIG.MONGODB_DB_NAME;
    return client.db(name);
  })();

  return dbPromise;
}
