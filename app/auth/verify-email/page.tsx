"use client";

import { type FormEvent, useState } from "react";
import { authCallbackUrl } from "@/lib/auth/customer";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("تحقق من بريدك الإلكتروني قبل استخدام الحساب.");
  async function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const { error } = await createClient().auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallbackUrl(window.location.origin) } }); setMessage(error ? "تعذر إعادة الإرسال الآن." : "تم إرسال رسالة تأكيد جديدة إذا كان الحساب يحتاجها."); }
  return <section className="mx-auto max-w-md px-4 py-16"><div className="card space-y-6"><h1 className="text-2xl font-black">تأكيد البريد الإلكتروني</h1><p className="text-sm text-charcoal/70">{message}</p><form className="space-y-4" onSubmit={onSubmit}><input className="field-input" dir="ltr" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="btn-primary w-full" type="submit">إعادة إرسال التأكيد</button></form></div></section>;
}
