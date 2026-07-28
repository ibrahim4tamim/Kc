"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("تعذر تسجيل الدخول. تحقق من بيانات الدخول.");
      setSubmitting(false);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="card space-y-6">
        <div>
          <h1 className="text-2xl font-black">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-charcoal/70">بوابة تأسيسية للمنصة الداخلية والعملاء.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="field-label">
            البريد الإلكتروني
            <input
              className="field-input mt-1"
              dir="ltr"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field-label">
            كلمة المرور
            <input
              className="field-input mt-1"
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {message && <p className="text-sm font-bold text-china-red">{message}</p>}
          <button className="btn-primary w-full" disabled={submitting} type="submit">
            {submitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </section>
  );
}
