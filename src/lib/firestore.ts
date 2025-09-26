"use server";

import { getFirestore, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import type { Pass } from "@/types";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const passesCol = collection(db, "passes");

/** Fetch all passes (handles Timestamp or Date gracefully) */
export async function getPasses(): Promise<Pass[]> {
  const snapshot = await getDocs(passesCol);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Pass[];
}

/** Add new pass */
export async function addPass(data: Omit<Pass, "id">) {
  const docRef = await addDoc(passesCol, data as any);
  return docRef.id;
}
