// ===========================
// ✅ User roles
// ===========================
export type UserRole = "admin" | "manager" | "user" | "pending" | "rejected";

// ===========================
// ✅ Pass status
// ===========================
export type PassStatus = "active" | "expired" | "revoked";

// ===========================
// ✅ Base user shape (used by auth hooks)
// ===========================
export interface AppUser {
  uid: string;
  email: string;
  displayName: string; // ✅ If you want fullName instead, rename this to fullName
  role: UserRole;
}

// ===========================
// ✅ Passes
// ===========================
export interface BasePass {
  id: string;
  type: "standard" | "visitor";
  status: PassStatus;
  createdAt: Date; // or firebase.firestore.Timestamp if you always store Timestamp
  createdBy: string; // user.uid
  createdByCompany?: string;
  qrPayload: {
    v: number; // version
    pid: string; // pass id
    pa: string; // pass alpha part (plate)
    pn: string; // pass number part
    exp: number; // expiry timestamp
  };
}

// -------- STANDARD PASS --------
export interface StandardPass extends BasePass {
  type: "standard";
  ownerName: string;
  ownerCompany: string;
  vehiclePlateAlpha: string;
  vehiclePlateNumber: string;
  location: string;
  expiresAt: Date; // or Timestamp if you prefer, but match firestore use
}

// -------- VISITOR PASS --------
export interface VisitorPass extends BasePass {
  type: "visitor";
  visitorName: string;
  visitorCompany: string;
  purpose: string;
  location: string;
  expiresAt: Date; // or Timestamp
}

// Union
export type Pass = StandardPass | VisitorPass;
