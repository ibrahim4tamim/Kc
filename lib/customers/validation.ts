import { z } from "zod";

export const CUSTOMER_TYPES = ["individual", "company"] as const;
export const CUSTOMER_STATUSES = ["lead", "active", "inactive", "archived"] as const;
export const CONTACT_STATUSES = ["active", "inactive", "archived"] as const;

const optionalText = (maximum: number) => z.string().trim().max(maximum).transform((value) => value || undefined).optional();
const optionalPhone = z.preprocess((value) => value === "" ? undefined : value, z.string().trim().max(40).regex(/^[+()0-9.\-\s]+$/, "Invalid phone value").optional());

export const customerInputSchema = z.object({
  customerType: z.enum(CUSTOMER_TYPES), displayName: z.string().trim().min(1).max(160), legalName: optionalText(220),
  status: z.enum(CUSTOMER_STATUSES).default("lead"), preferredLanguage: z.string().trim().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/).optional(),
  preferredCurrency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(), countryCode: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/).optional(),
  city: optionalText(120), website: z.string().trim().url().max(2048).optional(), taxNumber: optionalText(120), commercialRegistrationNumber: optionalText(120), notes: optionalText(4000),
});

export const customerContactInputSchema = z.object({
  fullName: z.string().trim().min(1).max(160), jobTitle: optionalText(160), email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()).optional(),
  phone: optionalPhone, whatsapp: optionalPhone, isPrimary: z.boolean().default(false), status: z.enum(CONTACT_STATUSES).default("active"),
  preferredLanguage: z.string().trim().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/).optional(), notes: optionalText(4000),
}).refine((value) => value.email || value.phone || value.whatsapp, "A contact method is required");

export type CustomerInput = z.infer<typeof customerInputSchema>;
export type CustomerContactInput = z.infer<typeof customerContactInputSchema>;
