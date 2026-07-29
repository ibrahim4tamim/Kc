"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await createClient().auth.updateUser({ password });
    setMessage(error ? "تعذر تحديث كلمة المرور. استخدم رابط إعادة التعيين الجديد." : "تم تحديث كلمة المرور. يمكنك متابعة حسابك.");
  }

  return <section className="mx-auto max-w-md px-4 py-16"><div className="card space-y-6"><h1 className="text-2xl font-black">كلمة مرور جديدة</h1><form className="space-y-4" onSubmit={onSubmit}><input className="field-input" dir="ltr" type="password" placeholder="كلمة المرور الجديدة" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /><button className="btn-primary w-full" type="submit">تحديث كلمة المرور</button></form>{message && <p className="text-sm text-charcoal/70">{message}</p>}</div></section>;
}
