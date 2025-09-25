"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, passConverter } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { buildQrPayload } from "@/lib/qr";
import PassPreviewDialog from "./pass-preview-dialog";
import type { Pass, VisitorPass } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  visitorName: z.string().min(2, "Required"),
  visitorCompany: z.string().min(1, "Required"),
  purpose: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  expiresAt: z.date(),
});

const locations = [
  "SEC 01",
  "SEC 02",
  "SEC 03",
  "SEC 04",
  "SEC 05",
  "SEC 06",
  "SEC 07",
  "SEC 08",
  "SEC 09",
  "SEC 10",
  "LD 01",
  "LD 02",
  "LD 03",
  "LD 04",
  "LD 05",
  "LD 06",
  "Pump Station",
];

export default function GenerateVisitorForm() {
  const { user, loading: userLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<Pass | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: "",
      visitorCompany: "",
      purpose: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a pass.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const passCollection = collection(db, "passes").withConverter(
        passConverter
      );

      const newPassData: Omit<VisitorPass, "id" | "qrPayload"> = {
        type: "visitor",
        visitorName: values.visitorName,
        visitorCompany: values.visitorCompany,
        purpose: values.purpose,
        location: values.location,
        expiresAt: Timestamp.fromDate(values.expiresAt), // ✅ convert to Timestamp
        status: "active",
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.fullName,
        createdByCompany: user.company,
      };

      const docRef = await addDoc(passCollection, newPassData as any);

      const finalPassData = {
        ...newPassData,
        id: docRef.id,
        expiresAt: values.expiresAt,
        createdAt: new Date(),
        qrPayload: buildQrPayload(
          docRef.id,
          "", // no plate alpha for visitor
          "", // no plate number
          values.expiresAt
        ),
      } as unknown as Pass;

      setGeneratedPass(finalPassData);
      toast({
        title: "Success",
        description: "Visitor pass created successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating visitor pass:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create pass. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="visitorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visitor Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitorCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visitor Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="Meeting / Delivery / Inspection" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid Until</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting || userLoading}
            className="w-full"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Visitor Pass
          </Button>
        </form>
      </Form>

      {generatedPass && (
        <PassPreviewDialog
          pass={generatedPass}
          open={!!generatedPass}
          onOpenChange={() => setGeneratedPass(null)}
        />
      )}
    </>
  );
}
