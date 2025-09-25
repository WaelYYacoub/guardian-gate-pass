import type { Timestamp } from "firebase/firestore";

/**
 * User roles for access control
 */
export type Role = "admin" | "manager" | "user";

/**
 * Status options for any pass
 */
export type PassStatus = "active" | "expired" | "revoked";

/**
 * Base fields shared by both Standard and Visitor passes
 */
export interface BasePass {
  id: string;
  type: "standard" | "visitor";
  status: PassStatus;
  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;
  createdByCompany?: string;
  qrPayload: {
    v: number; // version
    pid: string; // pass ID
    pa: string; // plate alpha
    pn: string; // plate number
    exp: number; // expiry timestamp (ms)
  };
}

/**
 * Standard Vehicle Pass
 */
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

/**
 * Visitor Pass
 */
export interface VisitorPass extends BasePass {
  type: "visitor";
  visitorName: string;
  visitorCompany: string;
  purpose: string;
  location: string;
  expiresAt: Timestamp;
}

/**
 * Union type for any pass
 */
export type Pass = StandardPass | VisitorPass;
