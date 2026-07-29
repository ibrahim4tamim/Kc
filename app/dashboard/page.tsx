import { redirect } from "next/navigation";
import { getCurrentAuthContext, getCurrentOrganization } from "@/lib/auth/server";

export default async function DashboardFoundationPage() {
  const { userId, role } = await getCurrentAuthContext();
  if (!userId) redirect("/auth/sign-in?next=/dashboard");
  const organization = await getCurrentOrganization();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="card space-y-5">
        <p className="section-label">KC Platform V2</p>
        <h1 className="text-3xl font-black">أساس المصادقة والصلاحيات</h1>
        <p className="leading-relaxed text-charcoal/75">
          تم التحقق من جلستك. لا تحتوي هذه الصفحة على أي سير عمل تشغيلي أو بيانات أعمال.
        </p>
        <p className="text-sm text-charcoal/60">الدور الحالي: {role ?? "بانتظار التعيين"}</p>
        <p className="text-sm text-charcoal/60">Active organization: {organization?.name ?? "pending assignment"}</p>
        <form action="/auth/sign-out" method="post">
          <button className="btn-outline-sm" type="submit">تسجيل الخروج</button>
        </form>
      </div>
    </section>
  );
}
