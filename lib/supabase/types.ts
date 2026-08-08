export const APP_ROLES = [
  "owner",
  "admin",
  "operations",
  "purchasing",
  "inspection",
  "finance",
  "customer",
] as const;

export type AppRole = (typeof APP_ROLES)[number];
export const MEMBERSHIP_STATUSES = ["active", "invited", "suspended"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];
export const ORGANIZATION_STATUSES = ["active", "archived"] as const;
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];
export const CUSTOMER_TYPES = ["individual", "company"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export const CUSTOMER_STATUSES = ["lead", "active", "inactive", "archived"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];
export const CUSTOMER_CONTACT_STATUSES = ["active", "inactive", "archived"] as const;
export type CustomerContactStatus = (typeof CUSTOMER_CONTACT_STATUSES)[number];
export type SupplierStatus = "active" | "inactive" | "suspended" | "archived";
export type SupplierVerificationStatus = "unverified" | "under_review" | "verified" | "restricted" | "archived";
export type SupplierLegalEntityType = "company" | "individual";
export type SupplierCapability = "manufacturer" | "trading_company" | "broker";
export type SupplierCertificateType = "ISO9001" | "ISO14001" | "ISO45001" | "CE" | "FDA" | "SGS" | "RoHS" | "BSCI" | "Sedex" | "Other";
export type SupplierCandidateStatus = "proposed" | "contacted" | "responding" | "quoted" | "shortlisted" | "rejected" | "selected" | "archived";
export type SupplierRequestType="quotation"|"moq"|"pricing_revision"|"sample"|"certificate"|"specification"|"packaging"|"photos"|"video"|"production_capacity"|"lead_time"|"payment_terms"|"shipping_terms"|"other"; export type SupplierRequestStatus="draft"|"sent"|"waiting_response"|"partially_received"|"completed"|"cancelled"|"archived"; export type SupplierResponseType="message"|"quotation"|"document"|"certificate"|"image"|"video"|"sample_update"|"clarification"|"rejection"|"other";
export type QuotationStatus="draft"|"received"|"under_review"|"accepted"|"rejected"|"superseded"|"archived";
export const RFQ_STATUSES = ["draft", "submitted", "under_review", "sourcing", "awaiting_customer", "approved", "cancelled", "completed", "archived"] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];
export const RFQ_ITEM_STATUSES = ["draft", "ready_for_sourcing", "sourcing", "awaiting_information", "shortlisted", "selected", "cancelled", "completed", "archived"] as const;
export type RfqItemStatus = (typeof RFQ_ITEM_STATUSES)[number];
export const RFQ_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type RfqPriority = (typeof RFQ_PRIORITIES)[number];
export type RfqVisibility = "internal" | "customer";
export type RfqAttachmentOwnerType = "rfq" | "rfq_item" | "supplier_response" | "quotation";
export type RfqActivityEventType = "rfq_created" | "rfq_submitted" | "rfq_status_changed" | "rfq_updated" | "rfq_item_created" | "rfq_item_updated" | "rfq_item_status_changed" | "attachment_added" | "attachment_archived" | "supplier_request_created" | "supplier_request_sent" | "supplier_response_received" | "supplier_request_completed" | "supplier_request_cancelled" | "quotation_received" | "quotation_revised" | "quotation_status_changed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: AppRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role?: AppRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: OrganizationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: OrganizationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: AppRole;
          status: MembershipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role: AppRole;
          status?: MembershipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      customers: {
        Row: { id: string; organization_id: string; profile_id: string | null; customer_type: CustomerType; display_name: string; legal_name: string | null; status: CustomerStatus; preferred_language: string | null; preferred_currency: string | null; country_code: string | null; city: string | null; website: string | null; tax_number: string | null; commercial_registration_number: string | null; notes: string | null; created_by: string | null; created_at: string; updated_at: string; archived_at: string | null; };
        Insert: { id?: string; organization_id: string; profile_id?: string | null; customer_type: CustomerType; display_name: string; legal_name?: string | null; status?: CustomerStatus; preferred_language?: string | null; preferred_currency?: string | null; country_code?: string | null; city?: string | null; website?: string | null; tax_number?: string | null; commercial_registration_number?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string; archived_at?: string | null; };
        Update: { customer_type?: CustomerType; display_name?: string; legal_name?: string | null; status?: CustomerStatus; preferred_language?: string | null; preferred_currency?: string | null; country_code?: string | null; city?: string | null; website?: string | null; tax_number?: string | null; commercial_registration_number?: string | null; notes?: string | null; archived_at?: string | null; updated_at?: string; };
        Relationships: [];
      };
      customer_contacts: {
        Row: { id: string; organization_id: string; customer_id: string; full_name: string; job_title: string | null; email: string | null; phone: string | null; whatsapp: string | null; is_primary: boolean; status: CustomerContactStatus; preferred_language: string | null; notes: string | null; created_by: string | null; created_at: string; updated_at: string; archived_at: string | null; };
        Insert: { id?: string; organization_id: string; customer_id: string; full_name: string; job_title?: string | null; email?: string | null; phone?: string | null; whatsapp?: string | null; is_primary?: boolean; status?: CustomerContactStatus; preferred_language?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string; archived_at?: string | null; };
        Update: { full_name?: string; job_title?: string | null; email?: string | null; phone?: string | null; whatsapp?: string | null; is_primary?: boolean; status?: CustomerContactStatus; preferred_language?: string | null; notes?: string | null; archived_at?: string | null; updated_at?: string; };
        Relationships: [];
      };
      rfqs: {
        Row: { id: string; organization_id: string; customer_id: string; primary_contact_id: string | null; public_reference: string; title: string; description: string | null; status: RfqStatus; priority: RfqPriority; source: string | null; preferred_currency: string | null; destination_country_code: string | null; destination_city: string | null; target_date: string | null; assigned_to: string | null; created_by: string | null; submitted_at: string | null; closed_at: string | null; archived_at: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; organization_id: string; customer_id: string; primary_contact_id?: string | null; public_reference?: string; title: string; description?: string | null; status?: RfqStatus; priority?: RfqPriority; source?: string | null; preferred_currency?: string | null; destination_country_code?: string | null; destination_city?: string | null; target_date?: string | null; assigned_to?: string | null; created_by?: string | null; submitted_at?: string | null; closed_at?: string | null; archived_at?: string | null; created_at?: string; updated_at?: string; };
        Update: { title?: string; description?: string | null; status?: RfqStatus; priority?: RfqPriority; source?: string | null; preferred_currency?: string | null; destination_country_code?: string | null; destination_city?: string | null; target_date?: string | null; assigned_to?: string | null; submitted_at?: string | null; closed_at?: string | null; archived_at?: string | null; updated_at?: string; };
        Relationships: [];
      };
      rfq_items: {
        Row: { id: string; organization_id: string; rfq_id: string; item_number: number; product_name: string; description: string | null; specifications: string | null; requested_quantity: number; unit: string; target_unit_price: number | null; target_currency: string | null; target_moq: number | null; target_lead_time_days: number | null; customization_required: boolean; branding_required: boolean; packaging_required: boolean; sample_required: boolean; status: RfqItemStatus; priority: RfqPriority; customer_notes: string | null; internal_notes: string | null; created_by: string | null; archived_at: string | null; created_at: string; updated_at: string; };
        Insert: Omit<Database["public"]["Tables"]["rfq_items"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string; };
        Update: Partial<Omit<Database["public"]["Tables"]["rfq_items"]["Row"], "id" | "organization_id" | "rfq_id" | "item_number" | "created_by" | "created_at">>;
        Relationships: [];
      };
      rfq_attachments: {
        Row: { id: string; organization_id: string; owner_type: RfqAttachmentOwnerType; owner_id: string; storage_bucket: string; storage_path: string; original_filename: string; content_type: string; file_size: number; visibility: RfqVisibility; uploaded_by: string | null; created_at: string; archived_at: string | null; };
        Insert: { id?: string; organization_id: string; owner_type: RfqAttachmentOwnerType; owner_id: string; storage_bucket: string; storage_path: string; original_filename: string; content_type: string; file_size: number; visibility?: RfqVisibility; uploaded_by?: string | null; created_at?: string; archived_at?: string | null; };
        Update: { visibility?: RfqVisibility; archived_at?: string | null; };
        Relationships: [];
      };
      rfq_activity_events: {
        Row: { id: string; organization_id: string; rfq_id: string; rfq_item_id: string | null; event_type: RfqActivityEventType; title: string; description: string | null; visibility: RfqVisibility; actor_user_id: string | null; metadata: Record<string, unknown> | null; occurred_at: string; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["rfq_activity_events"]["Row"], "id" | "created_at" | "occurred_at"> & { id?: string; created_at?: string; occurred_at?: string; };
        Update: never;
        Relationships: [];
      };
      suppliers: { Row: { id:string; organization_id:string; supplier_code:string; legal_name:string; display_name:string; supplier_status:SupplierStatus; verification_status:SupplierVerificationStatus; legal_entity_type:SupplierLegalEntityType; website:string|null; email:string|null; phone:string|null; whatsapp:string|null; country_code:string|null; province:string|null; city:string|null; address:string|null; postal_code:string|null; timezone:string|null; preferred_currency:string|null; preferred_language:string|null; years_in_business:number|null; employee_count:number|null; annual_capacity_notes:string|null; notes_internal:string|null; archived_at:string|null; created_at:string; updated_at:string }; Insert: { organization_id:string; supplier_code:string; legal_name:string; display_name:string; supplier_status?:SupplierStatus; verification_status?:SupplierVerificationStatus; legal_entity_type:SupplierLegalEntityType; website?:string|null; email?:string|null; phone?:string|null; whatsapp?:string|null; country_code?:string|null; province?:string|null; city?:string|null; address?:string|null; postal_code?:string|null; timezone?:string|null; preferred_currency?:string|null; preferred_language?:string|null; years_in_business?:number|null; employee_count?:number|null; annual_capacity_notes?:string|null; notes_internal?:string|null; archived_at?:string|null }; Update: Partial<Omit<Database["public"]["Tables"]["suppliers"]["Row"],"id"|"organization_id"|"supplier_code"|"created_at">>; Relationships: [] };
      supplier_capabilities: { Row:{supplier_id:string;organization_id:string;capability:SupplierCapability;created_at:string}; Insert:{supplier_id:string;organization_id:string;capability:SupplierCapability}; Update:never; Relationships:[] };
      supplier_contacts: { Row:{id:string;supplier_id:string;organization_id:string;name:string;position:string|null;email:string|null;phone:string|null;whatsapp:string|null;preferred_language:string|null;is_primary:boolean;archived_at:string|null;created_at:string;updated_at:string}; Insert:{supplier_id:string;organization_id:string;name:string;position?:string|null;email?:string|null;phone?:string|null;whatsapp?:string|null;preferred_language?:string|null;is_primary?:boolean;archived_at?:string|null}; Update:Partial<Omit<Database["public"]["Tables"]["supplier_contacts"]["Row"],"id"|"supplier_id"|"organization_id"|"created_at">>; Relationships:[] };
      supplier_certificates: { Row:{id:string;supplier_id:string;organization_id:string;certificate_type:SupplierCertificateType;certificate_number:string|null;issuing_body:string|null;issue_date:string|null;expiry_date:string|null;verification_notes:string|null;archived_at:string|null;created_at:string;updated_at:string}; Insert:{supplier_id:string;organization_id:string;certificate_type:SupplierCertificateType;certificate_number?:string|null;issuing_body?:string|null;issue_date?:string|null;expiry_date?:string|null;verification_notes?:string|null;archived_at?:string|null}; Update:Partial<Omit<Database["public"]["Tables"]["supplier_certificates"]["Row"],"id"|"supplier_id"|"organization_id"|"created_at">>; Relationships:[] };
      supplier_candidates: { Row:{id:string;organization_id:string;rfq_item_id:string;supplier_id:string;candidate_status:SupplierCandidateStatus;assigned_to_profile_id:string|null;internal_notes:string|null;archived_at:string|null;created_at:string;updated_at:string}; Insert:{organization_id:string;rfq_item_id:string;supplier_id:string;candidate_status?:SupplierCandidateStatus;assigned_to_profile_id?:string|null;internal_notes?:string|null;archived_at?:string|null}; Update:Partial<Omit<Database["public"]["Tables"]["supplier_candidates"]["Row"],"id"|"organization_id"|"rfq_item_id"|"supplier_id"|"created_at">>; Relationships:[] };
      supplier_requests:{Row:{id:string;organization_id:string;supplier_candidate_id:string;request_type:SupplierRequestType;subject:string;message:string|null;status:SupplierRequestStatus;assigned_to_profile_id:string|null;requested_by_profile_id:string|null;sent_at:string|null;due_at:string|null;completed_at:string|null;cancelled_at:string|null;internal_notes:string|null;created_at:string;updated_at:string;archived_at:string|null};Insert:{organization_id:string;supplier_candidate_id:string;request_type:SupplierRequestType;subject:string;message?:string|null;status?:SupplierRequestStatus;assigned_to_profile_id?:string|null;requested_by_profile_id?:string|null;sent_at?:string|null;due_at?:string|null;completed_at?:string|null;cancelled_at?:string|null;internal_notes?:string|null;archived_at?:string|null};Update:Partial<Omit<Database["public"]["Tables"]["supplier_requests"]["Row"],"id"|"organization_id"|"supplier_candidate_id"|"created_at">>;Relationships:[]};
      supplier_responses:{Row:{id:string;organization_id:string;supplier_request_id:string;response_type:SupplierResponseType;message:string|null;received_at:string;received_by_profile_id:string|null;supplier_contact_id:string|null;is_complete_response:boolean;internal_notes:string|null;created_at:string;archived_at:string|null};Insert:{organization_id:string;supplier_request_id:string;response_type:SupplierResponseType;message?:string|null;received_at?:string;received_by_profile_id?:string|null;supplier_contact_id?:string|null;is_complete_response?:boolean;internal_notes?:string|null;archived_at?:string|null};Update:Partial<Omit<Database["public"]["Tables"]["supplier_responses"]["Row"],"id"|"organization_id"|"supplier_request_id"|"created_at">>;Relationships:[]};
      quotations:{Row:{id:string;organization_id:string;rfq_id:string;rfq_item_id:string;supplier_id:string;supplier_candidate_id:string;supplier_request_id:string|null;supplier_response_id:string|null;quotation_reference:string;version_number:number;status:QuotationStatus;currency:string;quotation_date:string;valid_until:string|null;payment_terms:string|null;incoterm:string|null;lead_time_days:number|null;moq:number|null;supplier_notes:string|null;internal_notes:string|null;created_at:string;updated_at:string;archived_at:string|null};Insert:{id?:string;organization_id:string;rfq_id:string;rfq_item_id:string;supplier_id:string;supplier_candidate_id:string;supplier_request_id?:string|null;supplier_response_id?:string|null;quotation_reference:string;version_number:number;status?:QuotationStatus;currency:string;quotation_date?:string;valid_until?:string|null;payment_terms?:string|null;incoterm?:string|null;lead_time_days?:number|null;moq?:number|null;supplier_notes?:string|null;internal_notes?:string|null;created_at?:string;updated_at?:string;archived_at?:string|null};Update:Partial<Omit<Database["public"]["Tables"]["quotations"]["Row"],"id"|"organization_id"|"rfq_id"|"rfq_item_id"|"supplier_id"|"supplier_candidate_id"|"version_number"|"created_at">>;Relationships:[]};
      quotation_items:{Row:{id:string;organization_id:string;quotation_id:string;rfq_item_id:string;quantity:number;unit:string;unit_price:number;total_price:number;moq:number|null;packaging_info:string|null;lead_time_days:number|null;notes:string|null;created_at:string;updated_at:string};Insert:{id?:string;organization_id:string;quotation_id:string;rfq_item_id:string;quantity:number;unit:string;unit_price:number;moq?:number|null;packaging_info?:string|null;lead_time_days?:number|null;notes?:string|null;created_at?:string;updated_at?:string};Update:Partial<Omit<Database["public"]["Tables"]["quotation_items"]["Row"],"id"|"organization_id"|"quotation_id"|"rfq_item_id"|"total_price"|"created_at">>;Relationships:[]};
    };
    Views: Record<string, never>;
    Functions: {
      link_customer_profile: { Args: { target_customer_id: string; target_profile_id: string }; Returns: undefined };
      set_primary_customer_contact: { Args: { target_customer_id: string; target_contact_id: string }; Returns: undefined };
      get_my_customer: { Args: Record<string, never>; Returns: Array<{ id: string; organization_id: string; customer_type: CustomerType; display_name: string; legal_name: string | null; preferred_language: string | null; preferred_currency: string | null; country_code: string | null; city: string | null; website: string | null }> };
      get_my_customer_contacts: { Args: Record<string, never>; Returns: Array<{ id: string; customer_id: string; full_name: string; job_title: string | null; email: string | null; phone: string | null; whatsapp: string | null; is_primary: boolean; preferred_language: string | null }> };
      get_my_rfq_workspaces: { Args: Record<string, never>; Returns: Array<{ id: string; public_reference: string; title: string; description: string | null; status: RfqStatus; priority: RfqPriority; preferred_currency: string | null; destination_country_code: string | null; destination_city: string | null; target_date: string | null; submitted_at: string | null; closed_at: string | null; created_at: string }> };
      get_my_rfq_items: { Args: { target_rfq_id: string }; Returns: Array<{ id: string; item_number: number; product_name: string; description: string | null; specifications: string | null; requested_quantity: number; unit: string; target_unit_price: number | null; target_currency: string | null; target_moq: number | null; target_lead_time_days: number | null; customization_required: boolean; branding_required: boolean; packaging_required: boolean; sample_required: boolean; status: RfqItemStatus; priority: RfqPriority; customer_notes: string | null; created_at: string }> };
      get_my_rfq_attachments: { Args: { target_rfq_id: string }; Returns: Array<{ id: string; owner_type: RfqAttachmentOwnerType; owner_id: string; original_filename: string; content_type: string; file_size: number; created_at: string }> };
      get_my_rfq_activity: { Args: { target_rfq_id: string }; Returns: Array<{ id: string; rfq_item_id: string | null; event_type: RfqActivityEventType; title: string; description: string | null; occurred_at: string }> };
      replace_supplier_capabilities: { Args: { target_organization_id: string; target_supplier_id: string; selected_capabilities: SupplierCapability[] }; Returns: SupplierCapability[] };
      complete_supplier_response:{Args:{target_organization_id:string;target_supplier_request_id:string;target_response_type:SupplierResponseType;target_message:string|null;target_received_at:string|null;target_supplier_contact_id:string|null;target_internal_notes:string|null};Returns:Array<{response_id:string;response_type:SupplierResponseType;response_message:string|null;received_at:string;is_complete_response:boolean;request_id:string;request_status:SupplierRequestStatus;completed_at:string}>};
      create_quotation_revision:{Args:{target_organization_id:string;target_rfq_id:string;target_rfq_item_id:string;target_supplier_id:string;target_supplier_candidate_id:string;target_quotation_reference:string;target_status:QuotationStatus;target_currency:string;target_quotation_date:string;target_valid_until:string|null;target_payment_terms:string|null;target_incoterm:string|null;target_lead_time_days:number|null;target_moq:number|null;target_supplier_notes:string|null;target_internal_notes:string|null;target_supplier_request_id:string|null;target_supplier_response_id:string|null};Returns:Array<{id:string;organization_id:string;rfq_id:string;rfq_item_id:string;supplier_id:string;supplier_candidate_id:string;supplier_request_id:string|null;supplier_response_id:string|null;quotation_reference:string;version_number:number;status:QuotationStatus;currency:string;quotation_date:string;valid_until:string|null;payment_terms:string|null;incoterm:string|null;lead_time_days:number|null;moq:number|null;supplier_notes:string|null;internal_notes:string|null;created_at:string;updated_at:string;archived_at:string|null}>};
    };
    Enums: {
      app_role: AppRole;
      membership_status: MembershipStatus;
      organization_status: OrganizationStatus;
      customer_type: CustomerType;
      customer_status: CustomerStatus;
      customer_contact_status: CustomerContactStatus;
      rfq_status: RfqStatus;
      rfq_item_status: RfqItemStatus;
      rfq_priority: RfqPriority;
      rfq_visibility: RfqVisibility;
      rfq_attachment_owner_type: RfqAttachmentOwnerType;
      rfq_activity_event_type: RfqActivityEventType;
      supplier_status: SupplierStatus;
      supplier_verification_status: SupplierVerificationStatus;
      supplier_legal_entity_type: SupplierLegalEntityType;
      supplier_capability: SupplierCapability;
      supplier_certificate_type: SupplierCertificateType;
      supplier_candidate_status: SupplierCandidateStatus;
      supplier_request_type:SupplierRequestType;supplier_request_status:SupplierRequestStatus;supplier_response_type:SupplierResponseType;quotation_status:QuotationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
