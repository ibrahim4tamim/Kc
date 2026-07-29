"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { authCallbackUrl } from "@/lib/auth/customer";
import { createClient } from "@/lib/supabase/client";

export default function CustomerSignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: authCallbackUrl(window.location.origin),
      },
    });

    setSubmitting(false);
    setMessage(error ? "تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى." : "تحقق من بريدك الإلكتروني لتفعيل الحساب.");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="card space-y-6">
        <div><h1 className="text-2xl font-black">إنشاء حساب عميل</h1><p className="mt-2 text-sm text-charcoal/70">يُفعّل الحساب بعد تأكيد البريد الإلكتروني.</p></div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input className="field-input" placeholder="الاسم الكامل" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={160} />
          <input className="field-input" dir="ltr" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="field-input" dir="ltr" type="password" placeholder="كلمة المرور" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          {message && <p className="text-sm font-bold text-charcoal/70">{message}</p>}
          <button className="btn-primary w-full" disabled={submitting} type="submit">{submitting ? "جارٍ الإنشاء..." : "إنشاء الحساب"}</button>
        </form>
        <Link className="block text-center text-sm font-bold text-gold-deep" href="/auth/sign-in?next=/account">لديك حساب بالفعل؟ سجّل الدخول</Link>
      </div>
    </section>
  );
}
