"use client";

import { apiPost, apiRequest } from "./api";

export type CustomerPortalLoginResponse = {
  session: {
    serialNumber: string;
    productId: string;
    productName?: string;
    productModel?: string;
    soldDate?: string;
    customerId?: string;
  };
  product: {
    name?: string;
    model?: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  } | null;
  activeComplaint: {
    id: string;
    status: string;
    message: string;
  } | null;
};

export type CustomerComplaintResponse = {
  id: string;
  status: string;
  productSerialNo?: string;
  dateOfComplaint: string;
};

export async function customerPortalLogin(input: { serialNumber?: string; mobile: string }) {
  return apiPost<CustomerPortalLoginResponse>("/api/customer-portal/login", input, { auth: false });
}

export async function raiseCustomerComplaint(input: {
  serialNumber?: string;
  mobile: string;
  customerName?: string;
  customerEmail?: string;
  state: string;
  district: string;
  issueDescription: string;
  picture?: File | null;
}) {
  const body = new FormData();
  if (input.serialNumber?.trim()) body.append("serialNumber", input.serialNumber.trim());
  body.append("mobile", input.mobile.trim());
  if (input.customerName?.trim()) body.append("customerName", input.customerName.trim());
  if (input.customerEmail?.trim()) body.append("customerEmail", input.customerEmail.trim());
  body.append("state", input.state.trim());
  body.append("district", input.district.trim());
  body.append("issueDescription", input.issueDescription.trim());
  if (input.picture) body.append("picture", input.picture);
  return apiRequest<CustomerComplaintResponse>("/api/customer-portal/complaints", {
    method: "POST",
    auth: false,
    body,
  });
}
