// src/types/index.ts
// ✅ Updated to include visitorCompany for VisitorPass
import type { Timestamp } from "firebase/firestore";

export type PassStatus = "active" | "expired" | "revoked";

export interface BasePass {
  id: string;
  type: "standard" | "visitor";
  status: PassStatus;
  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;
  createdByCompany?: string;
  qrPayload: {
    v: number; // payload version
    pid: string; // pass id
    pa: string; // plate alpha (for standard) or visitor name
    pn: string; // plate num (for standard) or purpose
    exp: number; // expiry timestamp in seconds
  };
}

// --- STANDARD PASS ---
export interface StandardPass extends BasePass {
  type: "standard";
  plateAlpha: string;
  plateNum: string;
  ownerName: string;
  serial: string;
  ownerCompany: string;
  location: string;
  expiresAt: Timestamp;
}

// --- VISITOR PASS ---
export interface VisitorPass extends BasePass {
  type: "visitor";
  visitorName: string;
  visitorCompany: string; // ✅ ADDED FIELD
  purpose: string;
  location: string;
  expiresAt: Timestamp;
}

// A Pass can be either Standard or Visitor
export type Pass = StandardPass | VisitorPass;
