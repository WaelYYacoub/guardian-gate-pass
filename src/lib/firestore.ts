// src/lib/firestore.ts
import { db, auth } from "@/config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  type FirestoreDataConverter,
} from "firebase/firestore";
import type { Pass, UserProfile } from "@/types";

// Firestore converters
export const passConverter: FirestoreDataConverter<Pass> = {
  toFirestore: (pass) => pass,
  fromFirestore: (snap) => snap.data() as Pass,
};

export const userConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (user) => user,
  fromFirestore: (snap) => snap.data() as UserProfile,
};

// ---- Example Firestore utilities ----

// Fetch all passes
export async function getPasses(): Promise<Pass[]> {
  const q = query(collection(db, "passes").withConverter(passConverter));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

// Add or update a pass
export async function addPass(pass: Pass): Promise<void> {
  const ref = doc(collection(db, "passes").withConverter(passConverter));
  await setDoc(ref, pass);
}

// Update existing pass by id
export async function updatePass(id: string, data: Partial<Pass>): Promise<void> {
  const ref = doc(db, "passes", id).withConverter(passConverter);
  await updateDoc(ref, data);
}

// Delete a pass by id
export async function deletePass(id: string): Promise<void> {
  const ref = doc(db, "passes", id).withConverter(passConverter);
  await deleteDoc(ref);
}

// ---- Exports for app ----
export { db, auth, Timestamp };
