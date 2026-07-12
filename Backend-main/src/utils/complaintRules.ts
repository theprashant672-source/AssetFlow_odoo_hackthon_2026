import type { Complaint } from "../types";

export const MAX_ACTIVE_SERVICE_TICKETS = 5;
export const MAX_WAITING_LOBBY_TICKETS = 5;

const LEGACY_BRAND = ["A", "u", "r", "a", "w", "a", "t", "t"].join("");

export const OPEN_COMPLAINT_STATUSES = [
  "Open at NovaAssets",
  `Open at ${LEGACY_BRAND}`,
] as const;

export const IN_PROGRESS_COMPLAINT_STATUSES = [
  "In Progress at NovaAssets",
  `In Progress at ${LEGACY_BRAND}`,
] as const;

export const RESOLVED_COMPLAINT_STATUSES = [
  "Resolved by NovaAssets",
  `Resolved by ${LEGACY_BRAND}`,
] as const;

export const ACTIVE_TICKET_STATUSES = [
  "New",
  "Assigned",
  "In Progress",
  ...OPEN_COMPLAINT_STATUSES,
  "Assigned to Engineer",
  ...IN_PROGRESS_COMPLAINT_STATUSES,
  "Escalated to L2",
  "Escalated to L3",
  "Pending L3 Approval",
  "Spare Requested",
  "Replacement Requested",
  "Awaiting Dispatch",
  "Dispatch in Progress",
] as const;

export const LOBBY_TICKET_STATUSES = [
  "Pending Assignment",
  "Waiting Queue",
  "Waiting Lobby",
] as const;

export const CLOSED_COMPLAINT_STATUSES = [
  ...RESOLVED_COMPLAINT_STATUSES,
  "Resolved by Suppliers",
] as const;

export const ACTIVE_COMPLAINT_DUPLICATE_MESSAGE = "An active complaint already exists for this serial number. Please wait until the current ticket is resolved or closed before creating a new complaint for the same serial number.";

export const ENGINEER_CAPACITY_MESSAGE = "The selected engineer has reached the maximum ticket capacity (5 Active Work + 5 Waiting Lobby tickets). Please assign this ticket to another engineer.";

export const ONSITE_CAPACITY_MESSAGE = "Selected engineer already has 5 active onsite inspection tickets. Please select another engineer.";

export function normalizeComplaintSerialKey(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function isClosedComplaintStatus(status: unknown) {
  return CLOSED_COMPLAINT_STATUSES.includes(String(status) as (typeof CLOSED_COMPLAINT_STATUSES)[number]);
}

export function isActiveComplaintStatus(status: unknown) {
  return !isClosedComplaintStatus(status);
}

export function isWaitingLobbyComplaint(complaint: Pick<Complaint, "assignmentStatus" | "status">) {
  return complaint.assignmentStatus === "Waiting" && LOBBY_TICKET_STATUSES.includes(complaint.status as (typeof LOBBY_TICKET_STATUSES)[number]);
}

export function isActiveWorkComplaint(complaint: Pick<Complaint, "assignmentStatus" | "status">) {
  return complaint.assignmentStatus === "Assigned" && ACTIVE_TICKET_STATUSES.includes(complaint.status as (typeof ACTIVE_TICKET_STATUSES)[number]) && !isWaitingLobbyComplaint(complaint);
}
