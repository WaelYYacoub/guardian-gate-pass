// src/types/index.ts
// ===========================================================
// ✅ Master type definitions for Guardian Gate Pass project
// ===========================================================

import { FieldValue } from "firebase/firestore";

// --------------------
// 🔐 Authentication
// --------------------
export type UserRole = "admin" | "guard" | "manager";

// Basic user shape returned by our auth hook
export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role?: UserRole;
}

// --------------------
// 🚗 Pass Types
// --------------------
export interface StandardPass {
  id: string;               // Firestore doc id
  plateAlpha: string;
  plateNum: string;
  ownerName: string;
  ownerCompany: string;
  serial: string;
  location: string;
  expiresAt: Date;          // Always stored as Firestore Timestamp but typed as Date when read
  status: "active" | "inactive" | "expired";
  createdAt: Date | FieldValue; // ✅ allow FieldValue for serverTimestamp()
  createdBy: string;        // uid of creator
  qrPayload: string;        // JSON string for QR
  type: "standard";
}

export interface VisitorPass {
  id: string;
  visitorName: string;
  company: string;
  purpose: string;
  plateAlpha?: string;
  plateNum?: string;
  location: string;
  expiresAt: Date;
  status: "active" | "inactive" | "expired";
  createdAt: Date | FieldValue;
  createdBy: string;
  qrPayload: string;
  type: "visitor";
}

export interface BatchPass {
  id: string;
  batchName: string;
  ownerCompany: string;
  vehicles: {
    plateAlpha: string;
    plateNum: string;
    serial?: string;
  }[];
  location: string;
  expiresAt: Date;
  status: "active" | "inactive" | "expired";
  createdAt: Date | FieldValue;
  createdBy: string;
  qrPayload: string;
  type: "batch";
}

// --------------------
// 🔎 Generic
// --------------------
export type AnyPass = StandardPass | VisitorPass | BatchPass;

