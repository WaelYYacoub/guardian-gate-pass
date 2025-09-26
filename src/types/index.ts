export type Role = "admin" | "manager" | "user" | "pending" | "rejected";

export type PassStatus = "active" | "expired" | "revoked";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;           // ✅ added for sidebar welcome
  role: Role;
  createdAt: any;             // Firestore Timestamp | Date
}

export interface BasePass {
  id: string;
  createdAt: any;             // Firestore Timestamp | Date
  expiresAt: any;             // Firestore Timestamp | Date
  status: PassStatus;
  type: "standard" | "visitor";
  qrPayload: {
    v: number;
    pid: string;
    pa: string;
    pn: string;
    exp: number;
  };
  createdBy: string;
  createdByCompany?: string;
}

export interface StandardPass extends BasePass {
  type: "standard";
  plateNumber: string;
  ownerName: string;
  ownerCompany: string;
  location: string;
}

export interface VisitorPass extends BasePass {
  type: "visitor";
  visitorName: string;
  visitorCompany: string;
  purpose: string;
  location: string;
}

export type Pass = StandardPass | VisitorPass;
