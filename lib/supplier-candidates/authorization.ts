import type { AppRole } from "@/lib/supabase/types";
export const canReadCandidate=(r:AppRole|null)=>["owner","admin","operations","purchasing","inspection","finance"].includes(r??"");
export const canManageCandidate=(r:AppRole|null)=>["owner","admin","operations","purchasing"].includes(r??"");
export const canDeleteCandidate=(_:AppRole|null)=>false;
export type CandidateListDTO={id:string;rfqItemId:string;supplierId:string;candidateStatus:string;assignedToProfileId:string|null;createdAt:string};
export type CandidateDetailsDTO=CandidateListDTO & {internalNotes:string|null;updatedAt:string};
