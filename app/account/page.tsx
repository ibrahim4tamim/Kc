import { redirect } from "next/navigation";
import { isCustomerRole, isVerifiedCustomer } from "@/lib/auth/customer";
import { getAuthenticatedUser, getCurrentAuthContext, getCurrentOrganization, getCurrentProfile } from "@/lib/auth/server";

export default async function CustomerAccountPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/sign-in?next=/account");

  const { role } = await getCurrentAuthContext();
  if (role && !isCustomerRole(role)) redirect("/dashboard");
  if (!user.email_confirmed_at) redirect(`/auth/verify-email?email=${encodeURIComponent(user.email ?? "")}`);

  const [profile, organization] = await Promise.all([getCurrentProfile(), getCurrentOrganization()]);
  const active = isVerifiedCustomer(user.email_confirmed_at, role);

  return <section className="mx-auto max-w-3xl px-4 py-16"><div className="card space-y-4"><p className="section-label">KC Account</p><h1 className="text-3xl font-black">الحساب</h1><p>البريد الإلكتروني: {user.email}</p><p>الملف الشخصي: {profile?.display_name ?? "بانتظار الإعداد"}</p><p>المؤسسة: {organization?.name ?? "بانتظار العضوية"}</p><p>الدور: {active ? "customer" : "بانتظار تفعيل العضوية"}</p><form action="/auth/sign-out" method="post"><button className="btn-outline-sm" type="submit">تسجيل الخروج</button></form></div></section>;
}
