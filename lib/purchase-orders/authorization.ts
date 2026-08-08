import type { AppRole, PurchaseOrderStatus } from "@/lib/supabase/types";
export const canReadPurchaseOrder=(role:AppRole|null)=>["owner","admin","operations","purchasing","inspection","finance"].includes(role??"");
export const canManagePurchaseOrder=(role:AppRole|null)=>["owner","admin","operations","purchasing"].includes(role??"");
export const canDeletePurchaseOrder=(_:AppRole|null)=>false;
export type PurchaseOrderListDTO={id:string;purchaseOrderNumber:string;versionNumber:number;rfqId:string;rfqItemId:string;supplierId:string;status:PurchaseOrderStatus;currency:string;orderDate:string;expectedDeliveryDate:string|null;createdAt:string};
export type PurchaseOrderDetailsDTO=PurchaseOrderListDTO & {supplierCandidateId:string;supplierSelectionId:string;quotationId:string;incoterm:string|null;paymentTerms:string|null;supplierReference:string|null;internalNotes:string|null;supplierNotes:string|null;approvedBy:string|null;approvedAt:string|null;cancelledAt:string|null;archivedAt:string|null;updatedAt:string};
export type PurchaseOrderItemDTO={id:string;purchaseOrderId:string;rfqItemId:string;quotationItemId:string|null;quantity:number;unit:string;unitPrice:number;currency:string;lineTotal:number;productDescription:string|null;moq:number|null;agreedLeadTimeDays:number|null;packagingNotes:string|null;supplierNotes:string|null;internalNotes:string|null;createdAt:string};
export type PurchaseOrderAttachmentDTO={id:string;purchaseOrderId:string;originalFilename:string;contentType:string;fileSize:number;createdAt:string};
export type PurchaseOrderHistoryDTO=PurchaseOrderDetailsDTO;
