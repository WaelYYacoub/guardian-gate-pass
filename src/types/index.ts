// src/types/index.ts
export type UserRole = "admin" | "manager" | "user" | "pending" | "rejected";

export type PassStatus = "active" | "expired" | "revoked";

export interface BasePass {
  id: string;
  type: "standard" | "visitor";
  plateAlpha: string;
  plateNum: string;
  ownerName: string;
  /** ✅ added for company name */
  ownerCompany?: string;
  serial: string;
  location: string;
  expiresAt: Date;       // Firestore auto converts to Timestamp
  status: PassStatus;
  createdAt: Date;
  createdBy: string;     // uid of creator
  qrPayload: string;     // encoded payload for QR
}

export type StandardPass = Omit<BasePass, "type"> & {
  type: "standard";
};

export type VisitorPass = Omit<BasePass, "type"> & {
  type: "visitor";
};

export type Pass = StandardPass | VisitorPass;

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;  // admin, manager, user, pending, rejected
  createdAt: Date;
}
