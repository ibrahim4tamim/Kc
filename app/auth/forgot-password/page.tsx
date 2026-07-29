"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { passwordRecoveryUrl } from "@/lib/auth/customer";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createClient().auth.resetPasswordForEmail(email, { redirectTo: passwordRecoveryUrl(window.location.origin) });
    setMessage("إذا كان الحساب موجودًا، فستصل رسالة إعادة التعيين إلى بريدك.");
  }

  return <section className="mx-auto max-w-md px-4 py-16"><div className="card space-y-6"><h1 className="text-2xl font-black">إعادة تعيين كلمة المرور</h1><form className="space-y-4" onSubmit={onSubmit}><input className="field-input" dir="ltr" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="btn-primary w-full" type="submit">إرسال الرابط</button></form>{message && <p className="text-sm text-charcoal/70">{message}</p>}<Link className="block text-center text-sm font-bold text-gold-deep" href="/auth/sign-in?next=/account">العودة لتسجيل الدخول</Link></div></section>;
}
