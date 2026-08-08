import { describe, expect, it } from "vitest";
import { GET as health } from "../app/api/health/route";
import { isAppRole, isInternalRole, APP_ROLES } from "../lib/auth/roles";
import { safeRedirectPath } from "../lib/auth/redirects";
import { clientIp } from "../lib/rate-limit";
import { getSupabasePublicConfig } from "../lib/supabase/env";
import {
  canAssignMembershipRole,
  canPerformOwnerOperation,
  canReadOrganizationMemberships,
  isActiveMembership,
  isMembershipStatus,
  isSelfElevationAttempt,
} from "../lib/auth/membership";
import { authCallbackUrl, customerMembershipDefaults, isCustomerRole, isVerifiedCustomer, passwordRecoveryUrl, SIGN_OUT_REDIRECT_PATH } from "../lib/auth/customer";
import { canManageCustomerData, canReadCustomerData, canSelfLinkCustomer, customerSafeDto, hasSinglePrimaryContact } from "../lib/customers/authorization";
import { customerContactInputSchema, customerInputSchema } from "../lib/customers/validation";
import { canDeleteSupplier, canManageSupplier, canReadSupplier, sameSupplierOrganization } from "../lib/suppliers/authorization";
import { certificateInputSchema, supplierInputSchema } from "../lib/suppliers/validation";
import { canCustomerReadRfq, canManageRfq, canReadRfq } from "../lib/rfqs/authorization";
import { ACTIVITY_EVENT_TYPES, activityInputSchema, attachmentInputSchema, rfqInputSchema, rfqItemInputSchema } from "../lib/rfqs/validation";
import { canDeleteCandidate, canManageCandidate, canReadCandidate } from "../lib/supplier-candidates/authorization";
import { CANDIDATE_STATUSES, candidateInputSchema } from "../lib/supplier-candidates/validation";
import { REQUEST_STATUSES, REQUEST_TYPES, RESPONSE_TYPES, requestInputSchema, responseInputSchema } from "../lib/supplier-requests/validation";
import { canDeleteSupplierRequest, canManageSupplierRequest, canReadSupplierRequest } from "../lib/supplier-requests/authorization";
import { canDeleteQuotation, canManageQuotation, canReadQuotation } from "../lib/quotations/authorization";
import { QUOTATION_STATUSES, quotationInputSchema, quotationItemInputSchema } from "../lib/quotations/validation";

describe("Supabase foundation safety", () => {
  it("uses exactly the approved roles and keeps customer non-internal", () => {
    expect(APP_ROLES).toEqual([
      "owner",
      "admin",
      "operations",
      "purchasing",
      "inspection",
      "finance",
      "customer",
    ]);
    expect(isAppRole("admin")).toBe(true);
    expect(isAppRole("superadmin")).toBe(false);
    expect(isInternalRole("customer")).toBe(false);
    expect(isInternalRole("finance")).toBe(true);
  });

  it("accepts only local redirect paths", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("https://example.com")).toBe("/dashboard");
    expect(safeRedirectPath("//example.com")).toBe("/dashboard");
  });

  it("does not trust a generic forwarded-for header for rate limiting", () => {
    expect(clientIp(new Request("https://example.test", {
      headers: { "x-forwarded-for": "203.0.113.5" },
    }))).toBe("unknown");
    expect(clientIp(new Request("https://example.test", {
      headers: { "x-nf-client-connection-ip": "203.0.113.5" },
    }))).toBe("203.0.113.5");
  });

  it("fails clearly when Supabase public configuration is missing", () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabasePublicConfig()).toThrow("Supabase is not configured");

    if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    if (key) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
  });

  it("returns a non-sensitive health response", async () => {
    const response = await health();
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("keeps membership status and organization access active-only", () => {
    expect(isMembershipStatus("active")).toBe(true);
    expect(isMembershipStatus("suspended")).toBe(true);
    expect(isMembershipStatus("deleted")).toBe(false);
    expect(isActiveMembership("active")).toBe(true);
    expect(isActiveMembership("invited")).toBe(false);
    expect(isActiveMembership("suspended")).toBe(false);
  });

  it("does not allow client-side identity administration to create owners", () => {
    expect(canAssignMembershipRole("owner", "admin")).toBe(true);
    expect(canAssignMembershipRole("admin", "operations")).toBe(true);
    expect(canAssignMembershipRole("admin", "owner")).toBe(false);
    expect(canAssignMembershipRole("customer", "finance")).toBe(false);
    expect(canPerformOwnerOperation("owner")).toBe(true);
    expect(canPerformOwnerOperation("admin")).toBe(false);
  });

  it("separates customer membership visibility and rejects self-elevation", () => {
    expect(canReadOrganizationMemberships("owner")).toBe(true);
    expect(canReadOrganizationMemberships("admin")).toBe(true);
    expect(canReadOrganizationMemberships("customer")).toBe(false);
    expect(isSelfElevationAttempt("user-a", "user-a", "admin")).toBe(true);
    expect(isSelfElevationAttempt("user-a", "user-b", "admin")).toBe(false);
  });

  it("uses local Supabase callback and recovery URLs for customer registration and reset", () => {
    expect(authCallbackUrl("https://kc.example")).toBe("https://kc.example/auth/callback?next=%2Faccount");
    expect(passwordRecoveryUrl("https://kc.example")).toBe("https://kc.example/auth/update-password");
  });

  it("activates only verified customer accounts and never treats internal roles as customer", () => {
    expect(isVerifiedCustomer("2026-07-29T00:00:00Z", "customer")).toBe(true);
    expect(isVerifiedCustomer(null, "customer")).toBe(false);
    expect(isVerifiedCustomer("2026-07-29T00:00:00Z", "admin")).toBe(false);
    expect(isCustomerRole("customer")).toBe(true);
    expect(isCustomerRole("operations")).toBe(false);
    expect(customerMembershipDefaults()).toEqual({ role: "customer", status: "active" });
    expect(SIGN_OUT_REDIRECT_PATH).toBe("/auth/sign-in");
  });

  it("validates the approved customer model and normalizes international identity fields", () => {
    expect(customerInputSchema.parse({ customerType: "company", displayName: "  Example Co  ", preferredCurrency: "usd", countryCode: "sa", status: "lead" })).toMatchObject({ customerType: "company", displayName: "Example Co", preferredCurrency: "USD", countryCode: "SA" });
    expect(customerInputSchema.safeParse({ customerType: "person", displayName: "X" }).success).toBe(false);
    expect(customerInputSchema.safeParse({ customerType: "individual", displayName: "X", status: "deleted" }).success).toBe(false);
  });

  it("supports multiple contacts while enforcing usable contact methods and one primary contact", () => {
    expect(customerContactInputSchema.parse({ fullName: "Ada", email: "ADA@EXAMPLE.COM" })).toMatchObject({ email: "ada@example.com", status: "active" });
    expect(customerContactInputSchema.safeParse({ fullName: "Ada" }).success).toBe(false);
    expect(hasSinglePrimaryContact(0)).toBe(true);
    expect(hasSinglePrimaryContact(1)).toBe(true);
    expect(hasSinglePrimaryContact(2)).toBe(false);
  });

  it("limits customer data by role and strips customer-internal fields from safe DTOs", () => {
    expect(canManageCustomerData("operations")).toBe(true);
    expect(canManageCustomerData("purchasing")).toBe(false);
    expect(canReadCustomerData("finance")).toBe(true);
    expect(canReadCustomerData("customer")).toBe(false);
    expect(canSelfLinkCustomer("customer")).toBe(false);
    expect(customerSafeDto({ id: "customer-1", display_name: "Example", notes: "internal", tax_number: "tax", commercial_registration_number: "cr" })).toEqual({ id: "customer-1", displayName: "Example" });
  });
});

describe("RFQ core foundation", () => {
  it("validates RFQs, customer/contact identifiers, status, priority, and normalized location", () => {
    expect(rfqInputSchema.parse({ customerId: "11111111-1111-4111-8111-111111111111", primaryContactId: "22222222-2222-4222-8222-222222222222", title: "  Import workspace ", preferredCurrency: "usd", destinationCountryCode: "sa" })).toMatchObject({ title: "Import workspace", preferredCurrency: "USD", destinationCountryCode: "SA", status: "draft", priority: "normal" });
    expect(rfqInputSchema.safeParse({ customerId: "bad", title: "X" }).success).toBe(false);
    expect(rfqInputSchema.safeParse({ customerId: "11111111-1111-4111-8111-111111111111", title: "X", status: "quoted" }).success).toBe(false);
  });
  it("supports one or many independently numbered positive-quantity items", () => {
    const item = { itemNumber: 1, productName: "Widget", requestedQuantity: 1, unit: "pcs" };
    expect(rfqItemInputSchema.parse(item).itemNumber).toBe(1);
    expect(rfqItemInputSchema.parse({ ...item, itemNumber: 2 }).itemNumber).toBe(2);
    expect(rfqItemInputSchema.safeParse({ ...item, requestedQuantity: 0 }).success).toBe(false);
    expect(rfqItemInputSchema.safeParse({ ...item, status: "supplier_selected" }).success).toBe(false);
  });
  it("allows only approved attachment owners and safe metadata, without public paths", () => {
    expect(attachmentInputSchema.parse({ ownerType: "rfq", ownerId: "11111111-1111-4111-8111-111111111111", storageBucket: "rfq-files", storagePath: "org/file.pdf", originalFilename: "file.pdf", contentType: "application/pdf", fileSize: 1, visibility: "customer" }).visibility).toBe("customer");
    expect(attachmentInputSchema.safeParse({ ownerType: "supplier", ownerId: "11111111-1111-4111-8111-111111111111", storageBucket: "rfq-files", storagePath: "/unsafe", originalFilename: "x", contentType: "text/plain", fileSize: 1 }).success).toBe(false);
  });
  it("keeps activity bounded, explicitly visible, and foundation-only", () => {
    expect(activityInputSchema.parse({ eventType: "rfq_created", title: "Created", visibility: "customer" }).eventType).toBe("rfq_created");
    expect(activityInputSchema.safeParse({ eventType: "unapproved_event", title: "No" }).success).toBe(false);
  });
  it("enforces organization-scoped staff and linked-customer boundaries in pure authorization", () => {
    expect(canManageRfq("operations")).toBe(true); expect(canManageRfq("purchasing")).toBe(false);
    expect(canReadRfq("finance")).toBe(true); expect(canReadRfq("customer")).toBe(false);
    expect(canCustomerReadRfq("customer-a", "customer-a")).toBe(true); expect(canCustomerReadRfq("customer-a", "customer-b")).toBe(false);
  });
});

describe("supplier master data", () => { it("supports multiple capabilities and validates certificates",()=>{expect(supplierInputSchema.parse({supplierCode:"SUP-01",legalName:"Factory",displayName:"Factory",legalEntityType:"company",capabilities:["manufacturer","broker"],countryCode:"cn"}).capabilities).toHaveLength(2);expect(certificateInputSchema.safeParse({certificateType:"ISO9001",issueDate:"2026-01-02",expiryDate:"2026-01-01"}).success).toBe(false)}); it("keeps customer out and purchasing read-only",()=>{expect(canReadSupplier("customer")).toBe(false);expect(canReadSupplier("purchasing")).toBe(true);expect(canManageSupplier("purchasing")).toBe(false);expect(canManageSupplier("owner")).toBe(true)}) });
describe("supplier capability replacement boundary",()=>{it("requires a non-empty unique approved set",()=>{const base={supplierCode:"SUP-01",legalName:"Factory",displayName:"Factory",legalEntityType:"company"};expect(supplierInputSchema.safeParse({...base,capabilities:[]}).success).toBe(false);expect(supplierInputSchema.safeParse({...base,capabilities:["manufacturer","manufacturer"]}).success).toBe(false);expect(supplierInputSchema.safeParse({...base,capabilities:["invalid"]}).success).toBe(false)});it("keeps management role and organization boundaries explicit",()=>{expect(canManageSupplier("owner")).toBe(true);expect(canManageSupplier("admin")).toBe(true);expect(canManageSupplier("operations")).toBe(true);expect(canManageSupplier("finance")).toBe(false);expect(canDeleteSupplier("owner")).toBe(false);expect(sameSupplierOrganization("org-a","org-a")).toBe(true);expect(sameSupplierOrganization("org-a","org-b")).toBe(false)})});

describe("supplier candidate foundation",()=>{const ids={rfqItemId:"11111111-1111-4111-8111-111111111111",supplierId:"22222222-2222-4222-8222-222222222222"};it("uses only approved candidate statuses and archive pairing",()=>{expect(CANDIDATE_STATUSES).toEqual(["proposed","contacted","responding","quoted","shortlisted","rejected","selected","archived"]);expect(candidateInputSchema.parse(ids).candidateStatus).toBe("proposed");expect(candidateInputSchema.safeParse({...ids,candidateStatus:"quotation"}).success).toBe(false);expect(candidateInputSchema.safeParse({...ids,candidateStatus:"archived"}).success).toBe(false);expect(candidateInputSchema.parse({...ids,candidateStatus:"archived",archivedAt:"2026-08-03T00:00:00.000Z"}).candidateStatus).toBe("archived")});it("limits candidate workflow by role and exposes no delete",()=>{expect(canManageCandidate("owner")).toBe(true);expect(canManageCandidate("admin")).toBe(true);expect(canManageCandidate("operations")).toBe(true);expect(canManageCandidate("purchasing")).toBe(true);expect(canManageCandidate("inspection")).toBe(false);expect(canReadCandidate("inspection")).toBe(true);expect(canReadCandidate("finance")).toBe(true);expect(canReadCandidate("customer")).toBe(false);expect(canDeleteCandidate("owner")).toBe(false)})});

describe("supplier request and response foundation", () => {
  const candidateId = "11111111-1111-4111-8111-111111111111";
  const requestId = "22222222-2222-4222-8222-222222222222";
  it("uses only approved request and response values", () => {
    expect(REQUEST_TYPES).toContain("quotation");
    expect(REQUEST_STATUSES).toEqual(["draft", "sent", "waiting_response", "partially_received", "completed", "cancelled", "archived"]);
    expect(RESPONSE_TYPES).toContain("certificate");
    expect(requestInputSchema.parse({ supplierCandidateId: candidateId, requestType: "quotation", subject: "Quote" }).status).toBe("draft");
    expect(requestInputSchema.safeParse({ supplierCandidateId: candidateId, requestType: "invalid", subject: "Quote" }).success).toBe(false);
    expect(responseInputSchema.parse({ supplierRequestId: requestId, responseType: "message" }).isCompleteResponse).toBe(false);
  });
  it("requires consistent terminal request timestamps", () => {
    expect(requestInputSchema.safeParse({ supplierCandidateId: candidateId, requestType: "quotation", subject: "Quote", status: "completed" }).success).toBe(false);
    expect(requestInputSchema.safeParse({ supplierCandidateId: candidateId, requestType: "quotation", subject: "Quote", status: "cancelled" }).success).toBe(false);
    expect(requestInputSchema.parse({ supplierCandidateId: candidateId, requestType: "quotation", subject: "Quote", status: "archived", archivedAt: "2026-08-03T00:00:00.000Z" }).status).toBe("archived");
  });
  it("keeps supplier request access internal and prevents hard deletion", () => {
    expect(canManageSupplierRequest("purchasing")).toBe(true);
    expect(canReadSupplierRequest("inspection")).toBe(true);
    expect(canReadSupplierRequest("finance")).toBe(true);
    expect(canReadSupplierRequest("customer")).toBe(false);
    expect(canDeleteSupplierRequest("owner")).toBe(false);
  });
  it("defines the approved internal supplier request activity events", () => {
    expect(ACTIVITY_EVENT_TYPES).toEqual(expect.arrayContaining(["supplier_request_created", "supplier_request_sent", "supplier_response_received", "supplier_request_completed", "supplier_request_cancelled"]));
    expect(activityInputSchema.parse({ eventType: "supplier_request_sent", title: "Sent", visibility: "internal" }).visibility).toBe("internal");
    expect(activityInputSchema.parse({ eventType: "supplier_response_received", title: "Response", visibility: "internal" }).visibility).toBe("internal");
    expect(activityInputSchema.safeParse({ eventType: "supplier_response_received", title: "Response", visibility: "customer" }).success).toBe(false);
  });
});

describe("quotation foundation", () => {
  const ids = { rfqId: "11111111-1111-4111-8111-111111111111", rfqItemId: "22222222-2222-4222-8222-222222222222", supplierId: "33333333-3333-4333-8333-333333333333", supplierCandidateId: "44444444-4444-4444-8444-444444444444" };
  it("accepts approved commercial fields and validates version input boundaries", () => {
    expect(QUOTATION_STATUSES).toEqual(["draft", "received", "under_review", "accepted", "rejected", "superseded", "archived"]);
    expect(quotationInputSchema.parse({ ...ids, quotationReference: " Q-2026-01 ", currency: "usd", quotationDate: "2026-08-08", validUntil: "2026-08-09", incoterm: "fob", leadTimeDays: 10, moq: 1 }).currency).toBe("USD");
    expect(quotationInputSchema.safeParse({ ...ids, quotationReference: "Q-1", currency: "USD", quotationDate: "2026-08-08", validUntil: "2026-08-07" }).success).toBe(false);
    expect(quotationInputSchema.safeParse({ ...ids, quotationReference: "Q-1", currency: "USD", quotationDate: "2026-08-08", status: "superseded" }).success).toBe(false);
  });
  it("validates positive line quantities and non-negative unit prices", () => {
    expect(quotationItemInputSchema.parse({ rfqItemId: ids.rfqItemId, quantity: 1, unit: "pcs", unitPrice: 0 }).unit).toBe("pcs");
    expect(quotationItemInputSchema.safeParse({ rfqItemId: ids.rfqItemId, quantity: 0, unit: "pcs", unitPrice: 1 }).success).toBe(false);
    expect(quotationItemInputSchema.safeParse({ rfqItemId: ids.rfqItemId, quantity: 1, unit: "pcs", unitPrice: -1 }).success).toBe(false);
  });
  it("keeps quotations internal, role-scoped, and archive-only", () => {
    expect(canManageQuotation("owner")).toBe(true); expect(canManageQuotation("admin")).toBe(true); expect(canManageQuotation("operations")).toBe(true); expect(canManageQuotation("purchasing")).toBe(true);
    expect(canReadQuotation("inspection")).toBe(true); expect(canReadQuotation("finance")).toBe(true); expect(canManageQuotation("inspection")).toBe(false); expect(canManageQuotation("finance")).toBe(false);
    expect(canReadQuotation("customer")).toBe(false); expect(canDeleteQuotation("owner")).toBe(false);
  });
  it("keeps quotation attachment and activity metadata internal", () => {
    expect(attachmentInputSchema.parse({ ownerType: "quotation", ownerId: ids.rfqId, storageBucket: "rfq-files", storagePath: "org/quote.pdf", originalFilename: "quote.pdf", contentType: "application/pdf", fileSize: 1 }).ownerType).toBe("quotation");
    expect(activityInputSchema.safeParse({ eventType: "quotation_received", title: "Received", visibility: "customer" }).success).toBe(false);
    expect(activityInputSchema.parse({ eventType: "quotation_revised", title: "Revised", visibility: "internal" }).eventType).toBe("quotation_revised");
  });
});
