// src/types/index.ts
export type PassStatus = "active" | "expired" | "revoked";
export type PassType = "standard" | "visitor";

export interface StandardPass {
  id: string;
  type: "standard";
  plateAlpha: string;
  plateNum: string;
  ownerName: string;
  serial: string;
  location: string;
  company?: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: PassStatus;
  qrPayload: string;
}

export interface VisitorPass {
  id: string;
  type: "visitor";
  plateAlpha: string;
  plateNum: string;
  ownerName: string;
  location: string;
  company?: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: PassStatus;
  qrPayload: string;
}

export type Pass = StandardPass | VisitorPass;  // ✅ add this
