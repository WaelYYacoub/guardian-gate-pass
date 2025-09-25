// --------------------------------------------------
// ✅ User & Pass Type Definitions
// --------------------------------------------------

export type UserRole =
  | "admin"    // first user — approved by default, can approve others
  | "manager"  // needs admin approval
  | "user"     // needs admin approval
  | "pending"  // waiting for admin approval
  | "rejected"; // explicitly denied by admin

export type PassStatus =
  | "active"   // valid now
  | "expired"  // automatically expired after date/time
  | "revoked"; // manually canceled/denied by admin/manager/user

// Generic user model (adjust to your Firestore document shape)
export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt?: any; // Firestore timestamp
}

// Generic pass models (adjust to your Firestore document shape)
export interface BasePass {
  id: string;
  createdAt: any; // Firestore Timestamp
  expiresAt: any; // Firestore Timestamp
  status: PassStatus;
  createdBy: string; // uid
  createdByCompany?: string;
}

export interface StandardPass extends BasePass {
  type: "standard";
  plateAlpha: string;
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
