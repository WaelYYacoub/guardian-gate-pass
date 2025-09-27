// src/lib/firestore.ts
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import type { StandardPass, VisitorPass, PassStatus, AppUser, Role } from "@/types";

// -------------------------
// Users
// -------------------------

/**
 * Get all users
 */
export async function getUsers(): Promise<AppUser[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({
    uid: d.id,
    ...(d.data() as Omit<AppUser, "uid">),
  }));
}

/**
 * Get single user
 */
export async function getUser(uid: string): Promise<AppUser | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ uid: snap.id, ...(snap.data() as Omit<AppUser, "uid">) }) : null;
}

/**
 * Approve or update user role
 */
export async function updateUserRole(uid: string, role: Role) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { role });
}

// -------------------------
// Passes
// -------------------------

/**
 * Get all passes (standard + visitor)
 */
export async function getPasses(): Promise<(StandardPass | VisitorPass)[]> {
  const snapshot = await getDocs(collection(db, "passes"));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      // Firestore stores Timestamp, but may already be Date in some dev data
      createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? data.createdAt,
      expiresAt: (data.expiresAt as Timestamp)?.toDate?.() ?? data.expiresAt,
    } as StandardPass | VisitorPass;
  });
}

/**
 * Add a new pass (standard or visitor)
 */
export async function addPass(pass: Omit<StandardPass, "id"> | Omit<VisitorPass, "id">) {
  const ref = collection(db, "passes");
  return await addDoc(ref, pass);
}

/**
 * Update pass status (active / expired / revoked)
 */
export async function updatePassStatus(passId: string, status: PassStatus) {
  const ref = doc(db, "passes", passId);
  await updateDoc(ref, { status });
}

/**
 * Get passes filtered by status
 */
export async function getPassesByStatus(status: PassStatus): Promise<(StandardPass | VisitorPass)[]> {
  const ref = query(collection(db, "passes"), where("status", "==", status));
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? data.createdAt,
      expiresAt: (data.expiresAt as Timestamp)?.toDate?.() ?? data.expiresAt,
    } as StandardPass | VisitorPass;
  });
}
