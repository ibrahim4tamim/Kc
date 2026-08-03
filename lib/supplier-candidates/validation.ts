import { z } from "zod";
export const CANDIDATE_STATUSES=["proposed","contacted","responding","quoted","shortlisted","rejected","selected","archived"] as const;
export const candidateInputSchema=z.object({rfqItemId:z.string().uuid(),supplierId:z.string().uuid(),candidateStatus:z.enum(CANDIDATE_STATUSES).default("proposed"),assignedToProfileId:z.string().uuid().optional(),internalNotes:z.string().trim().max(4000).transform(v=>v||undefined).optional(),archivedAt:z.string().datetime().optional()}).refine(v=>(v.candidateStatus==="archived")===Boolean(v.archivedAt),"Archived status and timestamp must match");
export type CandidateInput=z.infer<typeof candidateInputSchema>;
