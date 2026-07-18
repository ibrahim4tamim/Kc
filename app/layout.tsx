import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "كواليس الصين | خدمة التوريد من الصين",
  description:
    "أرسل تفاصيل طلبك وسيساعدك فريق كواليس الصين في البحث عن المورد أو المصنع المناسب في الصين ومقارنة العروض.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-ivory font-arabic text-charcoal antialiased">
        <header className="border-b border-gold/30 bg-ivory/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-china-red text-xl font-black text-white">
                ك
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-black">كواليس الصين</span>
                <span className="block text-xs font-semibold tracking-widest text-gold">
                  KAWALIS CHINA
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-3 text-sm font-semibold">
              <Link href="/request" className="text-charcoal transition hover:text-china-red">
                طلب توريد
              </Link>
              <span className="text-gold">•</span>
              <Link href="/track" className="text-charcoal transition hover:text-china-red">
                تتبع طلبك
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10">{children}</main>

        <footer className="border-t border-gold/30 bg-charcoal py-8 text-center text-sm text-ivory/80">
          <p className="font-bold text-ivory">كواليس الصين — Kawalis China</p>
          <p className="mt-1">خدمة توريد ومصادر احترافية من الصين للسعودية والخليج</p>
          <p className="mt-3 text-xs text-ivory/50">
            © {new Date().getFullYear()} Kawalis China. جميع الحقوق محفوظة.
          </p>
        </footer>
      </body>
    </html>
  );
}
