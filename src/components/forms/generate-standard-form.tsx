"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import { db, passConverter } from "@/lib/firestore";
import type { StandardPass } from "@/types";

export default function GenerateStandardForm() {
  const [values, setValues] = useState({
    plateAlpha: "",
    plateNum: "",
    ownerName: "",
    ownerCompany: "",
    serial: "",
    location: "",
    expiresAt: new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
        expiresAt: values.expiresAt, // ✅ plain Date
        status: "active",
        createdAt: serverTimestamp(),
        createdBy: "system", // TODO: replace with real user.uid when auth is available
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

      alert("✅ Standard pass created successfully!");
      setValues({
        plateAlpha: "",
        plateNum: "",
        ownerName: "",
        ownerCompany: "",
        serial: "",
        location: "",
        expiresAt: new Date(),
      });
    } catch (err) {
      console.error("Error creating standard pass:", err);
      alert("❌ Failed to create standard pass.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Plate Alpha</label>
        <input
          type="text"
          name="plateAlpha"
          value={values.plateAlpha}
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      <div>
        <label>Plate Number</label>
        <input
          type="text"
          name="plateNum"
          value={values.plateNum}
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      <div>
        <label>Owner Name</label>
        <input
          type="text"
          name="ownerName"
          value={values.ownerName}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Owner Company</label>
        <input
          type="text"
          name="ownerCompany"
          value={values.ownerCompany}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Serial</label>
        <input
          type="text"
          name="serial"
          value={values.serial}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={values.location}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Expires At</label>
        <input
          type="date"
          name="expiresAt"
          value={values.expiresAt.toISOString().split("T")[0]}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              expiresAt: new Date(e.target.value),
            }))
          }
          className="input"
        />
      </div>

      <button type="submit" className="btn-primary">
        Create Standard Pass
      </button>
    </form>
  );
}
