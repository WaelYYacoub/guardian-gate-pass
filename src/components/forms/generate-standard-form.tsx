// src/components/forms/generate-standard-form.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db, passConverter } from "@/lib/firestore";
import { collection, addDoc } from "firebase/firestore";
import type { StandardPass } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GenerateStandardForm() {
  const { user } = useAuth();
  const [values, setValues] = useState({
    plateAlpha: "",
    plateNum: "",
    ownerName: "",
    ownerCompany: "",
    serial: "",
    location: "",
    expiresAt: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof values, val: string | Date) => {
    setValues((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const newPassData: Omit<StandardPass, "id" | "qrPayload"> = {
        type: "standard",
        plateAlpha: values.plateAlpha.toUpperCase(),
        plateNum: values.plateNum,
        ownerName: values.ownerName,
        ownerCompany: values.ownerCompany,
        serial: values.serial,
        location: values.location,
        expiresAt: values.expiresAt, // ✅ now plain Date
        status: "active",
        createdAt: new Date(), // ✅ plain Date
        createdBy: user.uid,
      };

      await addDoc(collection(db, "passes").withConverter(passConverter), newPassData);

      alert("Standard pass created successfully!");
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
      console.error(err);
      alert("Failed to create pass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Plate Letters</Label>
        <Input
          value={values.plateAlpha}
          onChange={(e) => handleChange("plateAlpha", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Plate Numbers</Label>
        <Input
          value={values.plateNum}
          onChange={(e) => handleChange("plateNum", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Owner Name</Label>
        <Input
          value={values.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Owner Company</Label>
        <Input
          value={values.ownerCompany}
          onChange={(e) => handleChange("ownerCompany", e.target.value)}
        />
      </div>
      <div>
        <Label>Serial</Label>
        <Input
          value={values.serial}
          onChange={(e) => handleChange("serial", e.target.value)}
        />
      </div>
      <div>
        <Label>Location</Label>
        <Input
          value={values.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>
      <div>
        <Label>Expires At</Label>
        <Input
          type="date"
          value={values.expiresAt.toISOString().slice(0, 10)}
          onChange={(e) =>
            handleChange("expiresAt", new Date(e.target.value))
          }
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Standard Pass"}
      </Button>
    </form>
  );
}
