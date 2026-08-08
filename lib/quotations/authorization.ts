import type { AppRole, QuotationStatus } from "@/lib/supabase/types";

export const canReadQuotation=(r:AppRole|null)=>["owner","admin","operations","purchasing","inspection","finance"].includes(r??"");
export const canManageQuotation=(r:AppRole|null)=>["owner","admin","operations","purchasing"].includes(r??"");
export const canDeleteQuotation=(_:AppRole|null)=>false;

export type QuotationListDTO={id:string;rfqItemId:string;supplierCandidateId:string;quotationReference:string;versionNumber:number;status:QuotationStatus;currency:string;validUntil:string|null;createdAt:string};
export type QuotationDetailsDTO=QuotationListDTO & {rfqId:string;supplierId:string;supplierRequestId:string|null;supplierResponseId:string|null;quotationDate:string;paymentTerms:string|null;incoterm:string|null;leadTimeDays:number|null;moq:number|null;supplierNotes:string|null;internalNotes:string|null;updatedAt:string;archivedAt:string|null};
export type QuotationItemDTO={id:string;quotationId:string;rfqItemId:string;quantity:number;unit:string;unitPrice:number;totalPrice:number;moq:number|null;packagingInfo:string|null;leadTimeDays:number|null;notes:string|null;createdAt:string;updatedAt:string};
export type QuotationAttachmentDTO={id:string;quotationId:string;originalFilename:string;contentType:string;fileSize:number;storageBucket:string;storagePath:string;createdAt:string};
