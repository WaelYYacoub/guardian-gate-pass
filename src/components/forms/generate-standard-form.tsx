import { serverTimestamp, addDoc, collection, doc } from "firebase/firestore";
import { db, passConverter } from "@/lib/firestore";
import type { StandardPass } from "@/types";

async function createStandardPass(values: FormValues, user: any) {
  // 1) Create a doc ref to get an ID
  const passRef = doc(collection(db, "passes"));
  const id = passRef.id;

  const newPassData: StandardPass = {
    id,
    type: "standard",
    plateAlpha: values.plateAlpha.toUpperCase(),
    plateNum: values.plateNum,
    ownerName: values.ownerName,
    ownerCompany: values.ownerCompany,
    serial: values.serial,
    location: values.location,
    expiresAt: values.expiresAt,
    status: "active",
    createdAt: serverTimestamp(),
    createdBy: user.uid,
    // ✅ Generate a payload (this can be as simple as JSON.stringify)
    qrPayload: JSON.stringify({
      id,
      plate: `${values.plateAlpha.toUpperCase()}${values.plateNum}`,
      serial: values.serial,
    }),
  };

  await addDoc(
    collection(db, "passes").withConverter(passConverter),
    newPassData
  );

  alert("Standard pass created successfully!");
}
