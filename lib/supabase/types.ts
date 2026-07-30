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
    };
    Views: Record<string, never>;
    Functions: {
      link_customer_profile: { Args: { target_customer_id: string; target_profile_id: string }; Returns: undefined };
      set_primary_customer_contact: { Args: { target_customer_id: string; target_contact_id: string }; Returns: undefined };
      get_my_customer: { Args: Record<string, never>; Returns: Array<{ id: string; organization_id: string; customer_type: CustomerType; display_name: string; legal_name: string | null; preferred_language: string | null; preferred_currency: string | null; country_code: string | null; city: string | null; website: string | null }> };
      get_my_customer_contacts: { Args: Record<string, never>; Returns: Array<{ id: string; customer_id: string; full_name: string; job_title: string | null; email: string | null; phone: string | null; whatsapp: string | null; is_primary: boolean; preferred_language: string | null }> };
    };
    Enums: {
      app_role: AppRole;
      membership_status: MembershipStatus;
      organization_status: OrganizationStatus;
      customer_type: CustomerType;
      customer_status: CustomerStatus;
      customer_contact_status: CustomerContactStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
