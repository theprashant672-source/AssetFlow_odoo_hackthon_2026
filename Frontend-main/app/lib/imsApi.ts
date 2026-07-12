"use client";

import { apiDelete, apiGet, apiPost, apiPut, apiRequest } from "./api";

export type ApiPage<T> = { data: T[]; total: number; page: number; limit: number };

export type UserSafe = {
  id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
  isActive?: boolean;
  assignedStates?: string[];
};

export type ServiceEngineer = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type PendingRegistration = {
  id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
  submittedAt: string;
};

export type PendingCustomerRegistration = {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone: string;
  address?: string;
  stateRegion?: string;
  registrationCode?: string;
  dateOfRegistration?: string;
  gst?: string;
  cinNo?: string;
  pan?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  areaAllotted?: string;
  distributorshipType?: string;
  documentsUploaded?: Array<CustomerDocument | string>;
  relevantSalesPerson?: string;
  status: "Pending" | "Approved";
  requestedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  customerId?: string;
};

export type CustomerDocument = {
  id: string;
  label: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  url: string;
  publicId?: string;
  resourceType?: string;
  format?: string;
  uploadedAt: string;
};

export type Customer = {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone: string;
  status: string;
  registrationCode?: string;
  address?: string;
  stateRegion?: string;
  dateOfRegistration?: string;
  cinNo?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  gst?: string;
  pan?: string;
  distributorshipType?: string;
  documentsUploaded?: Array<CustomerDocument | string>;
  areaAllotted?: string;
  relevantSalesPerson?: string;
};

export type Product = {
  id: string;
  series: string;
  model: string;
  description?: string;
  productDescription?: string;
  modelDescription?: string;
  hsnSac?: string;
  gstRate?: number;
  dealerPrice?: number;
  distributorPrice?: number;
};

export type RawMaterial = {
  id: string;
  productSeriesId: string;
  inwardMode?: "Local" | "International";
  materialName: string;
  dateReceived: string;
  billType: string;
  referenceNo: string;
  quantityReceived: number;
  quantityAvailable: number;
  vendorName: string;
  batch: string;
  notes?: string;
  returnStatus?: "Not Returned" | "Returned to Vendor" | "Replaced in Production";
  returnedQuantity?: number;
  returnReason?: string;
  returnedAt?: string;
  returnedBy?: string;
  returnedByName?: string;
  faultyQuantity?: number;
  repairedQuantity?: number;
  updatedAt?: string;
};

export type Manufactured = {
  id: string;
  productId: string;
  productModel?: string;
  serialNumber: string;
  mfgDate: string;
  status: string;
  invoiceNo?: string;
  paymentStatus: string;
  bomUsage?: {
    rawMaterialId?: string;
    materialName: string;
    batch?: string;
    inwardMode?: "Local" | "International";
    invoiceNo?: string;
    vendorName?: string;
    quantityUsed: number;
  }[];
  customerId?: string;
  customerPhones?: string[];
  soldDate?: string;
  returnReason?: string;
  returnedAt?: string;
  returnedBy?: string;
  returnedByName?: string;
  replacedWithSerial?: string;
  model?: string;
  updatedAt?: string;
};

export type SerialEntry = {
  id: string;
  serialNumber: string;
  productSeriesId: string;
  status: string;
  importFileName?: string;
  importFileUrl?: string;
  importFilePublicId?: string;
  uploadedAt: string;
};

export type Sale = {
  id: string;
  serialNumber?: string;
  vehicleNo?: string;
  documentType: string;
  referenceNo: string;
  saleDate: string;
  customerId?: string;
  customerName?: string;
  dealerName?: string;
  unregisteredCustomerName?: string;
  unregisteredCustomerAddress?: string;
  unregisteredCustomerGst?: string;
  shipToAddressKey?: "address" | "billingAddress" | "deliveryAddress1" | "deliveryAddress2" | "deliveryAddress3";
  registrationCode?: string;
  materialName?: string;
  quantity?: number;
  piItems?: {
    materialName: string;
    hsnSac?: string;
    quantity: number;
    rate: number;
    gstRate: number;
    serialNumbers?: string[];
  }[];
  stateRegion?: string;
  dealerRegistered?: boolean;
  rjApprovalStatus?: string;
  forcePiPermission?: boolean;
  priceCategory?: string;
  availableQuantity?: number;
  inventoryStatus?: string;
  forcePiApprovalStatus?: string;
  forcePiApprovedBy?: string;
  forcePiApprovedAt?: string;
  piAttachmentName?: string;
  piAttachmentUrl?: string;
  expectedDispatchDate?: string;
  confirmedDispatchDate?: string;
  dispatchStatus?: string;
  courierDocketNo?: string;
  courierDocketAttachmentName?: string;
  courierDocketAttachmentUrl?: string;
  taxInvoiceAttachmentName?: string;
  taxInvoiceAttachmentUrl?: string;
  ewayBillAttachmentName?: string;
  ewayBillAttachmentUrl?: string;
  accountsRequestAt?: string;
  accountsRequestBy?: string;
  accountsSharedAt?: string;
  accountsSharedBy?: string;
  paymentStatus?: string;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  dispatchReadyAt?: string;
  dispatchReadyBy?: string;
  finalDispatchAt?: string;
  finalDispatchBy?: string;
  piWorkflowVersion?: string;
  piWorkflowStatus?: string;
  piWorkflowHistory?: {
    id: string;
    action: string;
    fromStatus?: string;
    toStatus: string;
    department: string;
    by: string;
    byName?: string;
    byRole?: string;
    at: string;
    note?: string;
  }[];
  createdAt?: string;
};

export type DispatchAttachment = {
  fileName: string;
  fileType?: string;
  fileSize?: number;
  url: string;
  publicId?: string;
  resourceType?: string;
  format?: string;
  uploadedAt: string;
};

export type Complaint = {
  id: string;
  ticketNumber?: string;
  type: string;
  status: string;
  issueDescription: string;
  dateOfComplaint: string;
  createdAt?: string;
  customerReportedPictures?: DispatchAttachment[];
  faultyReturnType?: "Inverter" | "Spare Part" | string;
  faultyReturnItemId?: string;
  faultyReturnStatus?: "Not Required" | "Pending" | "Received" | string;
  updatedAt?: string;
  dateOfSale?: string;
  installationDate?: string;
  productSerialNo?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerPhones?: string[];
  customerEmail?: string;
  rawMaterialId?: string;
  rawMaterialName?: string;
  vendorName?: string;
  ticketSource?: string;
  l1Sla?: string;
  dealerName?: string;
  siteLocation?: string;
  state?: string;
  district?: string;
  region?: string;
  priority?: string;
  warrantyStatus?: string;
  productModel?: string;
  taxInvoiceNo?: string;
  taxInvoiceDate?: string;
  assignmentStatus?: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  backupEngineerName?: string;
  assignmentType?: "Primary L1" | "Backup L1" | "L2 Escalation";
  overflowFromEngineerId?: string;
  overflowFromEngineerName?: string;
  activeTicketCountAtAssignment?: number;
  escalatedById?: string;
  escalatedByName?: string;
  escalatedByRole?: string;
  escalatedAt?: string;
  escalationReason?: string;
  escalationNotes?: string;
  waitingSince?: string;
  slaStartedAt?: string;
  slaDueAt?: string;
  slaPaused?: boolean;
  queuePosition?: number;
  initialAction?: string;
  trackingNotes?: string;
  escalationLevel?: string;
  l1Inspection?: {
    inverterModel?: string;
    serialNumber?: string;
    errorCode?: string;
    eTotalKwh?: number;
    physicalChecks?: Record<string, boolean>;
    acReadings?: Record<string, number | undefined>;
    dcReadings?: Record<string, number | undefined>;
    batteryReadings?: Record<string, number | boolean | undefined>;
    systemStatus?: Record<string, boolean>;
    errorFrequency?: string;
    repeatIssue?: boolean;
    systemShutdown?: boolean;
    faultType?: string;
    observationNotes?: string;
    remoteResolutionPossible?: boolean;
    siteVisitRequiredSuspected?: boolean;
    spareSuspected?: boolean;
    escalateToL2?: boolean;
  };
  onsiteInspection?: {
    inverterModel?: string;
    serialNumber?: string;
    errorCode?: string;
    eTotalKwh?: number;
    physicalChecks?: Record<string, boolean>;
    acReadings?: Record<string, number | undefined>;
    dcReadings?: Record<string, number | undefined>;
    batteryReadings?: Record<string, number | boolean | undefined>;
    systemStatus?: Record<string, boolean>;
    observationNotes?: string;
    inverterPictures?: DispatchAttachment[];
  };
  l1InspectionValid?: boolean;
  serviceStartedAt?: string;
  progressUpdates?: {
    id: string;
    date: string;
    note: string;
    byName?: string;
    byRole?: string;
    createdAt: string;
  }[];
  technicalDiagnosis?: string;
  spareRequired?: boolean;
  spareName?: string;
  spareQuantity?: number;
  spareDispatchAddress?: string;
  spareParts?: Array<{
    id: string;
    series?: string;
    rawMaterialId?: string;
    materialName: string;
    availableQuantity?: number;
    quantity: number;
    notes?: string;
  }>;
  spareInventoryStatus?: string;
  spareRequestStatus?: string;
  dispatchTrackingNo?: string;
  dispatchLrCopyName?: string;
  dispatchLrCopyUrl?: string;
  procurementStatus?: string;
  chargeableApprovalStatus?: string;
  paymentVerificationStatus?: string;
  replacementApprovalStatus?: string;
  replacementRecommended?: boolean;
  replacementSeriesName?: string;
  replacementModelName?: string;
  replacementProductName?: string;
  replacementProductNo?: string;
  replacementRequestSerialNo?: string;
  replacementSerialNo?: string;
  replacementEngineerId?: string;
  replacementEngineerName?: string;
  replacementReason?: string;
  replacementRemarks?: string;
  replacementRequestImages?: DispatchAttachment[];
  replacementRequestedById?: string;
  replacementRequestedByName?: string;
  replacementRequestedByRole?: string;
  replacementRequestedAt?: string;
  replacementApprovedById?: string;
  replacementApprovedByName?: string;
  replacementApprovedByRole?: string;
  replacementApprovedAt?: string;
  dispatchPlan?: string;
  siteVisitRequired?: boolean;
  siteVisitEngineerId?: string;
  siteVisitEngineerName?: string;
  siteVisitRequestedById?: string;
  siteVisitRequestedByName?: string;
  siteVisitRequestedByRole?: string;
  siteVisitRequestedAt?: string;
  siteVisitAcceptedAt?: string;
  siteVisitRemarks?: string;
  siteVisitSpareParts?: Array<{ id: string; name: string; quantity: number; notes?: string }>;
  siteVisitScheduledDate?: string;
  siteVisitAssignedById?: string;
  siteVisitAssignedByName?: string;
  siteVisitAssignedByRole?: string;
  siteVisitCompletedAt?: string;
  engineerName?: string;
  l3SupportRequired?: boolean;
  finalResolution?: string;
  clientFeedback?: string;
  closureReport?: string;
  closeRemark?: string;
  closedByName?: string;
  closedByRole?: string;
  closedAt?: string;
  workflowHistory?: {
    id: string;
    action: string;
    fromStatus?: string;
    toStatus: string;
    by: string;
    byName?: string;
    byRole?: string;
    at: string;
    note?: string;
  }[];
};

export type EngineerDashboardData = {
  counts: {
    runningTickets: number;
    closedTickets: number;
    slaMonitoring: number;
    onsiteTickets: number;
  };
  runningTickets: Complaint[];
  closedTickets: Complaint[];
  onsiteTickets: Complaint[];
  slaMonitoring: {
    approaching: Complaint[];
    delayed: Complaint[];
  };
  trends: {
    weekly: { labels: string[]; created: number[]; completed: number[] };
    monthly: { labels: string[]; created: number[]; completed: number[] };
    yearly: { labels: string[]; created: number[]; completed: number[] };
  };
};

export type Distributor = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  phone?: string;
  address: string;
  unitsSold: number;
  isActive?: boolean;
  source?: "customer" | "legacy";
  type?: "Distributor";
  status?: string;
  stateRegion?: string;
  registrationCode?: string;
  dateOfRegistration?: string;
  gst?: string;
  cinNo?: string;
  pan?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  areaAllotted?: string;
  distributorshipType?: string;
  relevantSalesPerson?: string;
};

export type DashboardStats = {
  rawMaterials: { totalAvailable: number };
  manufactured: { total: number; inStock: number; sold: number };
  distributors: { total: number };
  customers: { total: number };
  complaints: { total: number; open: number };
};

export type DashboardTimeline = {
  months: string[];
  raw: number[];
  manufactured: number[];
  sales: number[];
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
  isRead: boolean;
};

export type EngineerRole = "L1" | "L2" | "L3";

export type EngineerMaster = {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: EngineerRole;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EngineerAssignment = {
  id: string;
  state: string;
  district: string;
  l1EngineerId: string;
  l2EngineerId: string;
  l1BackupEngineerId: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  l1Engineer?: EngineerMaster | null;
  l2Engineer?: EngineerMaster | null;
  l1BackupEngineer?: EngineerMaster | null;
  l1Load?: { engineerId: string; activeCount: number; waitingCount: number; totalCount: number; lastUpdated: string; updatedAt: string } | null;
  l2Load?: { engineerId: string; activeCount: number; waitingCount: number; totalCount: number; lastUpdated: string; updatedAt: string } | null;
  backupLoad?: { engineerId: string; activeCount: number; waitingCount: number; totalCount: number; lastUpdated: string; updatedAt: string } | null;
};

export type EngineerAssignmentAudit = {
  id: string;
  assignmentId: string;
  action: "created" | "updated" | "deleted" | "imported";
  state?: string;
  district?: string;
  before?: Partial<EngineerAssignment>;
  after?: Partial<EngineerAssignment>;
  note?: string;
  by?: string;
  byName?: string;
  createdAt: string;
};

export type EngineerAssignmentOptions = {
  states: string[];
  districts: string[];
  districtsByState?: Record<string, string[]>;
  engineers: EngineerMaster[];
};

export type IndiaGeography = {
  states: string[];
  districtsByState: Record<string, string[]>;
  stateDistrictEntries: Array<{ state: string; districts: string[] }>;
};

export type IndiaStatesResponse = {
  states: string[];
};

export type IndiaDistrictsResponse = {
  state: string;
  districts: string[];
};

export async function getDashboardStats() {
  return apiGet<DashboardStats>("/api/dashboard/stats");
}

export async function getDashboardTimeline(months = 6) {
  return apiGet<DashboardTimeline>("/api/dashboard/timeline", { months });
}

export async function getIndiaGeography() {
  return apiGet<IndiaGeography>("/api/geo");
}

export async function getIndiaStates() {
  return apiGet<IndiaStatesResponse>("/api/geo/states");
}

export async function getIndiaDistricts(state: string) {
  return apiGet<IndiaDistrictsResponse>("/api/geo/districts", { state });
}

export async function listEngineerAssignments(params: { q?: string; state?: string; district?: string; page?: number; limit?: number } = {}) {
  return apiGet<ApiPage<EngineerAssignment>>("/api/engineer-assignments", {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    q: params.q,
    state: params.state,
    district: params.district,
  });
}

export async function listEngineerAssignmentOptions() {
  return apiGet<EngineerAssignmentOptions>("/api/engineer-assignments/options");
}

export async function checkAmIL1Backup() {
  return apiGet<{ isL1Backup: boolean }>("/api/engineer-assignments/am-i-l1-backup");
}

export async function listEngineerAssignmentAudit(params: { q?: string; page?: number; limit?: number } = {}) {
  return apiGet<ApiPage<EngineerAssignmentAudit>>("/api/engineer-assignments/audit", {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    q: params.q,
  });
}

export type EngineerAssignmentCreateResult = EngineerAssignment | { assignments: EngineerAssignment[] };

export async function createEngineerAssignment(input: {
  state: string;
  district?: string;
  districts?: string[];
  l1EngineerName: string;
  l2EngineerName: string;
  l1BackupEngineerName?: string;
}): Promise<EngineerAssignmentCreateResult> {
  return apiPost<EngineerAssignmentCreateResult>("/api/engineer-assignments", input);
}

export async function updateEngineerAssignment(
  id: string,
  input: Partial<{
    state: string;
    district: string;
    l1EngineerName: string;
    l2EngineerName: string;
    l1BackupEngineerName: string;
  }>
) {
  return apiPut<EngineerAssignment>(`/api/engineer-assignments/${id}`, input);
}

export async function deleteEngineerAssignment(id: string) {
  return apiDelete<{ message: string }>(`/api/engineer-assignments/${id}`);
}

export async function importEngineerAssignments(file: File) {
  const form = new FormData();
  form.set("file", file);
  return apiRequest<{
    inserted: number;
    updated: number;
    deleted: number;
    warnings: string[];
    rows: Array<{ state: string; district: string; l1EngineerName: string; l2EngineerName: string; l1BackupEngineerName: string }>;
  }>("/api/engineer-assignments/import", {
    method: "POST",
    body: form,
  });
}

export async function rebuildEngineerLoads() {
  return apiPost<Array<{ engineerId: string; activeCount: number; waitingCount: number; totalCount: number; lastUpdated: string; updatedAt: string }>>("/api/engineer-assignments/rebuild-loads", {});
}

export async function cleanupStaleEngineerAssignments() {
  return apiPost<{ removed: number; backupCleared: number; mastersDeleted: number; removedRows: Array<{ state: string; district: string }> }>(
    "/api/engineer-assignments/cleanup-stale",
    {}
  );
}

export async function listUsers() {
  return apiGet<UserSafe[]>("/api/users");
}

export async function listPendingRegistrations() {
  return apiGet<PendingRegistration[]>("/api/users/pending-registrations");
}

export async function approvePendingRegistration(id: string) {
  return apiPost<{ message: string; user: UserSafe }>(`/api/users/approve/${id}`, {});
}

export async function updateUser(
  id: string,
  input: { name?: string; mobile?: string; role?: string; isActive?: boolean; password?: string; assignedStates?: string[] }
) {
  return apiPut<UserSafe>(`/api/users/${id}`, input);
}

export async function createUser(input: {
  name: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
  isActive?: boolean;
  assignedStates?: string[];
}) {
  return apiPost<UserSafe>("/api/users", input);
}

export async function deleteUser(id: string) {
  return apiDelete<{ message: string }>(`/api/users/${id}`);
}

export async function listCustomers(params: { q?: string; type?: string; page?: number; limit?: number } = {}) {
  return apiGet<ApiPage<Customer>>("/api/customers", { page: 1, limit: 100, ...params });
}

export async function createCustomer(input: {
  name: string;
  type: string;
  email: string;
  phone: string;
  address?: string;
  stateRegion?: string;
  registrationCode?: string;
  dateOfRegistration?: string;
  gst?: string;
  cinNo?: string;
  pan?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  areaAllotted?: string;
  distributorshipType?: string;
  relevantSalesPerson?: string;
  documentsUploaded?: Array<CustomerDocument | string>;
}) {
  return apiPost<Customer>("/api/customers", input);
}

export async function requestCustomerRegistration(input: {
  name: string;
  type: string;
  email?: string;
  phone: string;
  address?: string;
  stateRegion?: string;
  registrationCode?: string;
  dateOfRegistration?: string;
  gst?: string;
  cinNo?: string;
  pan?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  areaAllotted?: string;
  distributorshipType?: string;
  documentsUploaded?: Array<CustomerDocument | string>;
  relevantSalesPerson?: string;
}) {
  return apiPost<{ message: string; request: PendingCustomerRegistration }>("/api/customers/request-registration", input);
}

export async function uploadCustomerDocument(file: File, label: string) {
  const form = new FormData();
  form.set("document", file);
  form.set("label", label);
  return apiRequest<CustomerDocument>("/api/customers/upload-document", {
    method: "POST",
    body: form,
  });
}

export async function listPendingCustomerRegistrations() {
  return apiGet<PendingCustomerRegistration[]>("/api/customers/pending-registrations");
}

export async function approvePendingCustomerRegistration(id: string) {
  return apiPost<{ message: string; customer: Customer }>(`/api/customers/approve/${id}`, {});
}

export async function updateCustomer(
  id: string,
  input: {
    name?: string;
    type?: string;
    email?: string;
    phone?: string;
    address?: string;
    stateRegion?: string;
    registrationCode?: string;
    dateOfRegistration?: string;
    gst?: string;
    cinNo?: string;
    pan?: string;
    tan?: string;
    contactPersonName?: string;
    billingAddress?: string;
    deliveryAddress1?: string;
    deliveryAddress2?: string;
    deliveryAddress3?: string;
    areaAllotted?: string;
    distributorshipType?: string;
    relevantSalesPerson?: string;
    status?: string;
    documentsUploaded?: Array<CustomerDocument | string>;
  }
) {
  return apiPut<Customer>(`/api/customers/${id}`, input);
}

export async function updatePendingCustomerRegistration(
  id: string,
  input: {
    name?: string;
    type?: string;
    email?: string;
    phone?: string;
    address?: string;
    stateRegion?: string;
    registrationCode?: string;
    dateOfRegistration?: string;
    gst?: string;
    cinNo?: string;
    pan?: string;
    tan?: string;
    contactPersonName?: string;
    billingAddress?: string;
    deliveryAddress1?: string;
    deliveryAddress2?: string;
    deliveryAddress3?: string;
    areaAllotted?: string;
    distributorshipType?: string;
    documentsUploaded?: Array<CustomerDocument | string>;
    relevantSalesPerson?: string;
  }
) {
  return apiPut<PendingCustomerRegistration>(`/api/customers/pending-registrations/${id}`, input);
}

export async function importDistributorWorkbook(file: File, target: "pending" | "active") {
  const form = new FormData();
  form.set("file", file);
  form.set("target", target);
  return apiRequest<{ message: string; inserted: number; skipped: number; warnings: string[] }>("/api/customers/import-distributors", {
    method: "POST",
    body: form,
  });
}

export async function deleteCustomer(id: string) {
  return apiDelete<{ message: string }>(`/api/customers/${id}`);
}

export async function listProducts(params: { q?: string; series?: string } = {}) {
  return apiGet<Product[]>("/api/products", params);
}

export async function createProduct(input: {
  series: string;
  model: string;
  description?: string;
  productDescription?: string;
  modelDescription?: string;
  hsnSac?: string;
  gstRate?: number;
  dealerPrice?: number;
  distributorPrice?: number;
}) {
  return apiPost<Product>("/api/products", input);
}

export async function updateProduct(id: string, input: Partial<Pick<Product, "series" | "model" | "description" | "productDescription" | "modelDescription" | "hsnSac" | "gstRate" | "dealerPrice" | "distributorPrice">>) {
  return apiPut<Product>(`/api/products/${id}`, input);
}

export async function deleteProduct(id: string) {
  return apiDelete<{ message: string }>(`/api/products/${id}`);
}

/** Any Indian state/UT name — the Price Input Module can add new ones beyond the original six. */
export type PriceStateName = string;

export type PriceStatePoint = {
  distributor: number;
  dealer: number;
  msp: number;
};

export type PriceEntry = {
  id: string;
  srNo?: number;
  description: string;
  modelNo: string;
  modelKey: string;
  prices: Record<PriceStateName, PriceStatePoint>;
  createdAt: string;
  updatedAt: string;
};

export async function listPriceEntries() {
  return apiGet<PriceEntry[]>("/api/price-entries");
}

export async function createPriceEntry(input: {
  srNo?: number;
  description: string;
  modelNo: string;
  modelKey: string;
  prices: Partial<Record<PriceStateName, PriceStatePoint>>;
}) {
  return apiPost<PriceEntry>("/api/price-entries", input);
}

export async function updatePriceEntry(
  id: string,
  input: Partial<Pick<PriceEntry, "srNo" | "description" | "modelNo">> & { prices?: Partial<Record<PriceStateName, PriceStatePoint>> }
) {
  return apiPut<PriceEntry>(`/api/price-entries/${id}`, input);
}

export async function deletePriceEntry(id: string) {
  return apiDelete<{ message: string }>(`/api/price-entries/${id}`);
}

export type BOMItem = {
  materialName: string;
  quantity: number;
};

export type SeriesBOM = {
  id: string;
  series: string;
  items: BOMItem[];
  createdAt: string;
  updatedAt: string;
};

export async function listBOMs(params: { series?: string } = {}) {
  return apiGet<SeriesBOM[]>("/api/boms", params);
}

export async function createBOM(input: { series: string; items: BOMItem[] }) {
  return apiPost<SeriesBOM>("/api/boms", input);
}

export async function updateBOM(id: string, input: { items: BOMItem[] }) {
  return apiPut<SeriesBOM>(`/api/boms/${id}`, input);
}

export async function deleteBOM(id: string) {
  return apiDelete<{ message: string }>(`/api/boms/${id}`);
}

export async function listRawMaterials(params: { q?: string; series?: string; batch?: string; vendor?: string; inwardMode?: string } = {}) {
  return apiGet<ApiPage<RawMaterial>>("/api/raw-materials", { page: 1, limit: 100, ...params });
}

export async function getRawMaterialMeta() {
  return apiGet<{ vendors: string[] }>("/api/raw-materials/meta");
}

export async function createRawMaterial(input: {
  productSeriesId: string;
  inwardMode?: "Local" | "International";
  materialName: string;
  dateReceived: string;
  billType: string;
  referenceNo: string;
  quantityReceived: number;
  vendorName: string;
  batch?: string;
  notes?: string;
}) {
  return apiPost<RawMaterial>("/api/raw-materials", input);
}

export async function createInward(input: {
  inwardMode?: "Local" | "International";
  vendorName: string;
  dateReceived: string;
  billType: string;
  referenceNo: string;
  notes?: string;
  items: Array<{
    productSeriesId: string;
    materialName: string;
    quantityReceived: number;
  }>;
}) {
  return apiPost<any>("/api/inwards", input);
}

export async function updateRawMaterial(
  id: string,
  input: Partial<Pick<RawMaterial,
    "productSeriesId" | "inwardMode" | "materialName" | "dateReceived" | "billType" | "referenceNo" | "quantityReceived" | "quantityAvailable" | "vendorName" | "batch" | "notes"
  >>
) {
  return apiPut<RawMaterial>(`/api/raw-materials/${id}`, input);
}

export async function deleteRawMaterial(id: string) {
  return apiDelete<{ message: string }>(`/api/raw-materials/${id}`);
}

export async function markRawMaterialReturn(id: string, input: { returnReason?: string; returnedQuantity: number; returnStatus?: string; returnedAt?: string }) {
  return apiPost<RawMaterial>(`/api/raw-materials/${id}/return`, input);
}

export async function listManufactured(params: { q?: string; status?: string; model?: string; page?: number; limit?: number } = {}) {
  return apiGet<ApiPage<Manufactured>>("/api/manufactured", { page: 1, limit: 100, ...params });
}

export async function listManufacturedApprovalRequests() {
  return apiGet<ApiPage<Complaint>>("/api/manufactured/approval-requests");
}

export async function approveManufacturedApprovalRequest(
  id: string,
  input: { replacementSerialNo?: string; note?: string } = {}
) {
  return apiPost<Complaint>(`/api/manufactured/approval-requests/${id}/approve`, input);
}

export async function createManufactured(input: {
  productId: string;
  serialNumber?: string;
  mfgDate: string;
  status?: string;
  invoiceNo?: string;
  paymentStatus?: string;
  bomUsage?: Manufactured["bomUsage"];
}) {
  return apiPost<Manufactured>("/api/manufactured", input);
}

export async function updateManufactured(
  id: string,
  input: Partial<
    Pick<
      Manufactured,
      "productId" | "serialNumber" | "mfgDate" | "status" | "invoiceNo" | "paymentStatus" | "customerId" | "soldDate" | "returnReason"
    >
  >
) {
  return apiPut<Manufactured>(`/api/manufactured/${id}`, input);
}

export async function updateManufacturedBom(id: string, bomUsage: Manufactured["bomUsage"]) {
  return apiPut<Manufactured>(`/api/manufactured/${id}/bom`, { bomUsage });
}

export async function markManufacturedReturn(id: string, returnReason?: string, replacedWithSerial?: string) {
  return apiPost<Manufactured>(`/api/manufactured/${id}/return`, { returnReason: returnReason || "", replacedWithSerial });
}

export async function listSerials(params: { q?: string; series?: string; status?: string; page?: number; limit?: number } = {}) {
  return apiGet<ApiPage<SerialEntry>>("/api/serials", { page: 1, limit: 10000, ...params });
}

export async function importSerials(productSeriesId: string, file: File) {
  const form = new FormData();
  form.set("productSeriesId", productSeriesId);
  form.set("serials", file);
  return apiRequest<{
    imported: number;
    duplicatesSkipped: number;
    duplicates: string[];
    file?: DispatchAttachment;
  }>("/api/serials/import", {
    method: "POST",
    body: form,
  });
}

export async function listSales(params: { page?: number; limit?: number; sort?: string } = {}) {
  return apiGet<ApiPage<Sale>>("/api/sales", { page: 1, limit: 100, ...params });
}

export async function getNextPiNumber(year?: number) {
  return apiGet<{ referenceNo: string }>("/api/sales/next-pi-number", year ? { year } : undefined);
}

export async function createSale(input: {
  serialNumber?: string;
  documentType: string;
  referenceNo: string;
  saleDate: string;
  customerId?: string;
  unregisteredCustomerName?: string;
  unregisteredCustomerAddress?: string;
  unregisteredCustomerGst?: string;
  shipToAddressKey?: Sale["shipToAddressKey"];
  registrationCode?: string;
  materialName?: string;
  quantity?: number;
  piItems?: {
    materialName: string;
    hsnSac?: string;
    quantity: number;
    rate: number;
    gstRate: number;
  }[];
  stateRegion?: string;
  dealerRegistered?: boolean;
  rjApprovalStatus?: string;
  forcePiPermission?: boolean;
  priceCategory?: string;
  availableQuantity?: number;
  inventoryStatus?: string;
  forcePiApprovalStatus?: string;
  piAttachmentName?: string;
  piAttachmentUrl?: string;
  expectedDispatchDate?: string;
  confirmedDispatchDate?: string;
  dispatchStatus?: string;
  courierDocketNo?: string;
  courierDocketAttachmentName?: string;
  courierDocketAttachmentUrl?: string;
  paymentStatus?: string;
}) {
  return apiPost<Sale>("/api/sales", input);
}

export async function updateSaleBasicInfo(
  id: string,
  input: {
    documentType: string;
    referenceNo: string;
    saleDate: string;
    customerId?: string;
    unregisteredCustomerName?: string;
    unregisteredCustomerAddress?: string;
    unregisteredCustomerGst?: string;
    dealerRegistered?: boolean;
    stateRegion?: string;
    serialNumber?: string;
    materialName?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    customerType?: string;
  }
) {
  return apiPut<Sale>(`/api/sales/${id}`, input);
}

export async function updateSalesDispatch(
  id: string,
  input: Pick<Sale, "saleDate" | "piAttachmentName" | "piAttachmentUrl" | "expectedDispatchDate" | "confirmedDispatchDate" | "dispatchStatus">
) {
  return apiPut<Sale>(`/api/sales/${id}/sales-dispatch`, input);
}

export async function updateDispatchTeam(
  id: string,
  input: Partial<Pick<
    Sale,
    "serialNumber" | "confirmedDispatchDate" | "dispatchStatus" | "courierDocketNo" | "courierDocketAttachmentName" | "courierDocketAttachmentUrl" | "vehicleNo" | "piItems"
  >> & { forwardToAccounts?: boolean }
) {
  return apiPut<Sale>(`/api/sales/${id}/dispatch-team`, input);
}

export async function updateAccountsDocuments(
  id: string,
  input: Partial<Pick<
    Sale,
    "taxInvoiceAttachmentName" | "taxInvoiceAttachmentUrl" | "ewayBillAttachmentName" | "ewayBillAttachmentUrl" | "paymentStatus"
  >>
) {
  return apiPut<Sale>(`/api/sales/${id}/accounts`, input);
}

type ForcePiUpdateInput = Partial<Pick<
  Sale,
  "documentType" | "referenceNo" | "saleDate" | "customerId" | "unregisteredCustomerName" | "unregisteredCustomerAddress" | "unregisteredCustomerGst" | "shipToAddressKey" | "registrationCode" | "materialName" | "quantity" | "piItems" | "stateRegion" | "dealerRegistered" | "priceCategory" | "availableQuantity" | "inventoryStatus" | "expectedDispatchDate" | "dispatchStatus" | "paymentStatus"
>>;

export async function updatePendingForcePi(id: string, input: ForcePiUpdateInput) {
  return apiPut<Sale>(`/api/sales/${id}/force-pi`, input);
}

export async function approveForcePi(
  id: string,
  input: ForcePiUpdateInput = {}
) {
  return apiPost<Sale>(`/api/sales/${id}/approve-force-pi`, input);
}

export async function uploadDispatchDocket(file: File) {
  const form = new FormData();
  form.set("docket", file);
  return apiRequest<DispatchAttachment>("/api/sales/upload-docket", {
    method: "POST",
    body: form,
  });
}

export async function uploadPiAttachment(file: File) {
  const form = new FormData();
  form.set("pi", file);
  return apiRequest<DispatchAttachment>("/api/sales/upload-pi", {
    method: "POST",
    body: form,
  });
}

export async function uploadComplaintInverterPicture(file: File) {
  const form = new FormData();
  form.set("picture", file);
  return apiRequest<DispatchAttachment>("/api/complaints/upload-inverter-picture", {
    method: "POST",
    body: form,
  });
}

export async function listComplaints(params: { type?: string; status?: string; view?: "onsite-tracking" } = {}) {
  return apiGet<ApiPage<Complaint>>("/api/complaints", { page: 1, limit: 1000, ...params });
}

export async function listServiceEngineers() {
  return apiGet<ServiceEngineer[]>("/api/complaints/service-engineers");
}

export async function listMyL1Team() {
  return apiGet<Array<{ id: string; name: string; role: string }>>("/api/complaints/my-l1-team");
}

export async function createComplaint(input: {
  type: string;
  dateOfComplaint: string;
  issueDescription: string;
  productSerialNo?: string;
  customerName?: string;
  mobileNumber?: string;
  customerPhone?: string;
  customerEmail?: string;
  dateOfSale?: string;
  installationDate?: string;
  rawMaterialId?: string;
  rawMaterialName?: string;
  vendorName?: string;
  ticketSource?: string;
  l1Sla?: string;
  dealerName?: string;
  siteLocation?: string;
  state?: string;
  district?: string;
  region?: string;
  priority?: string;
  warrantyStatus?: string;
  productModel?: string;
  forceAssign?: boolean;
  backupEngineerName?: string;
  initialAction?: string;
  trackingNotes?: string;
  escalationLevel?: string;
  l1Inspection?: Complaint["l1Inspection"];
  onsiteInspection?: Complaint["onsiteInspection"];
  technicalDiagnosis?: string;
  spareRequired?: boolean;
  spareName?: string;
  spareQuantity?: number;
  spareDispatchAddress?: string;
  spareParts?: Array<{
    id: string;
    series?: string;
    rawMaterialId?: string;
    materialName: string;
    availableQuantity?: number;
    quantity: number;
    notes?: string;
  }>;
  spareInventoryStatus?: string;
  spareRequestStatus?: string;
  dispatchTrackingNo?: string;
  dispatchLrCopyName?: string;
  dispatchLrCopyUrl?: string;
  procurementStatus?: string;
  chargeableApprovalStatus?: string;
  paymentVerificationStatus?: string;
  replacementApprovalStatus?: string;
  replacementRecommended?: boolean;
  replacementSeriesName?: string;
  replacementModelName?: string;
  replacementProductName?: string;
  replacementProductNo?: string;
  replacementRequestSerialNo?: string;
  replacementSerialNo?: string;
  replacementEngineerId?: string;
  replacementEngineerName?: string;
  dispatchPlan?: string;
  siteVisitRequired?: boolean;
  engineerName?: string;
  l3SupportRequired?: boolean;
  finalResolution?: string;
  clientFeedback?: string;
  closureReport?: string;
  closeRemark?: string;
  closedByName?: string;
  closedByRole?: string;
  closedAt?: string;
}) {
  return apiPost<Complaint>("/api/complaints", input);
}

export async function updateComplaintStatus(id: string, status: string) {
  return apiPut<Complaint>(`/api/complaints/${id}/status`, { status });
}

export async function startComplaintSla(id: string) {
  return apiPost<Complaint>(`/api/complaints/${id}/start-sla`, {});
}

export async function updateComplaintService(id: string, input: Partial<Complaint> & {
  forceAssign?: boolean;
  reassignEngineerName?: string;
  notifyAdminOnCompletion?: boolean;
  preferredEngineerId?: string;
  preferredEngineerName?: string;
  assignToEngineerId?: string;
  assignToRole?: string;
  sendReplacementRequest?: boolean;
}) {
  return apiPut<Complaint>(`/api/complaints/${id}/service`, input);
}

export async function getComplaintStats() {
  return apiGet<Array<{ status: string; count: number }>>("/api/complaints/stats");
}

export async function getEngineerDashboard() {
  return apiGet<EngineerDashboardData>("/api/dashboard/engineer");
}

export async function listDistributors(params: { q?: string } = {}) {
  return apiGet<Distributor[]>("/api/distributors", params);
}

export async function createDistributor(input: {
  name: string;
  email: string;
  mobile: string;
  address: string;
  stateRegion?: string;
  dateOfRegistration?: string;
  gst?: string;
  cinNo?: string;
  pan?: string;
  tan?: string;
  contactPersonName?: string;
  billingAddress?: string;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryAddress3?: string;
  areaAllotted?: string;
  distributorshipType?: string;
  relevantSalesPerson?: string;
}) {
  return apiPost<Distributor>("/api/distributors", input);
}

export async function updateDistributor(
  id: string,
  input: {
    name?: string;
    email?: string;
    mobile?: string;
    address?: string;
    unitsSold?: number;
    isActive?: boolean;
    stateRegion?: string;
    dateOfRegistration?: string;
    gst?: string;
    cinNo?: string;
    pan?: string;
    tan?: string;
    contactPersonName?: string;
    billingAddress?: string;
    deliveryAddress1?: string;
    deliveryAddress2?: string;
    deliveryAddress3?: string;
    areaAllotted?: string;
    distributorshipType?: string;
    relevantSalesPerson?: string;
  }
) {
  return apiPut<Distributor>(`/api/distributors/${id}`, input);
}

export async function deleteDistributor(id: string) {
  return apiDelete<{ message: string }>(`/api/distributors/${id}`);
}

export async function listNotifications(params: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
  return apiGet<ApiPage<NotificationItem>>("/api/notifications", {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    unreadOnly: params.unreadOnly ? 1 : undefined,
  });
}

export async function getUnreadNotificationCount() {
  const res = await apiGet<{ count: number }>("/api/notifications/unread-count");
  return res.count;
}

export async function markNotificationRead(id: string) {
  return apiPost<{ message: string }>(`/api/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead() {
  return apiPost<{ updated: number }>("/api/notifications/read-all", {});
}

export type RoleConfig = {
  id: string;
  name: string;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: string;
  updatedAt: string;
};

export async function listRoles() {
  return apiGet<RoleConfig[]>("/api/roles");
}

export async function createRole(name: string) {
  return apiPost<RoleConfig>("/api/roles", { name });
}

export async function updateRolePermissions(roleId: string, permissions: string[]) {
  return apiPut<RoleConfig>(`/api/roles/${encodeURIComponent(roleId)}`, { permissions });
}

export async function deleteRole(roleId: string) {
  return apiDelete<{ message: string }>(`/api/roles/${encodeURIComponent(roleId)}`);
}

export type FaultyReturnData = {
  returnRecords: Complaint[];
  pendingReturns: Complaint[];
  faultyInverters: Manufactured[];
  faultySpares: RawMaterial[];
  repairedInverters: Manufactured[];
  repairedSpares: RawMaterial[];
};

export async function getFaultyReturns() {
  return apiGet<FaultyReturnData>("/api/manufactured/faulty-returns");
}

export async function receiveFaultyReturn(complaintId: string, notes: string) {
  return apiPut<{ message: string }>(`/api/manufactured/faulty-return/${encodeURIComponent(complaintId)}/receive`, { notes });
}

export async function markFaultyItemRepaired(type: "Inverter" | "Spare Part", id: string) {
  return apiPut<{ message: string }>("/api/manufactured/mark-repaired", { type, id });
}
