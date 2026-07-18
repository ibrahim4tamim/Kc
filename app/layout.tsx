import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp-client";
import "./globals.css";

export const metadata: Metadata = {
  title: "كواليس الصين | التوريد من الصين بثقة وشفافية",
  description:
    "نجد لك المصنع المناسب في الصين وندير عملية التوريد كاملة — تحقق من الموردين، مقارنة عروض، تفاوض، متابعة إنتاج، وفحص جودة حتى وصول شحنتك.",
};

const NAV_LINKS = [
  { href: "/#process", label: "كيف نعمل" },
  { href: "/#deliverables", label: "خدماتنا" },
  { href: "/#why", label: "لماذا كواليس الصين" },
  { href: "/#faq", label: "الأسئلة الشائعة" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ivory font-arabic text-charcoal antialiased">
        {/* هيدر نحيف ثابت */}
        <header className="sticky top-0 z-50 border-b border-charcoal/[0.06] bg-ivory/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              {/* تركيبة الشعار الأفقي — تُستبدل بملف الشعار الرسمي عند رفعه إلى public/logo-horizontal.png */}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal font-latin text-base font-bold text-gold">
                KC
              </span>
              <span className="leading-none">
                <span className="block text-base font-black">كواليس الصين</span>
                <span className="mt-0.5 block font-latin text-[9px] font-semibold tracking-[0.22em] text-gold-deep">
                  KAWALIS CHINA
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-charcoal/80 transition hover:text-china-red">
                  {l.label}
                </Link>
              ))}
              <Link href="/track" className="text-charcoal/80 transition hover:text-china-red">
                تتبع الطلب
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/track" className="text-sm font-bold text-charcoal/80 transition hover:text-china-red md:hidden">
                تتبع الطلب
              </Link>
              <Link
                href="/request"
                className="rounded-lg bg-china-red px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#b32222]"
              >
                ابدأ طلب توريد
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-[70vh]">{children}</main>

        {/* فوتر بسيط واحترافي */}
        <footer className="border-t border-gold/20 bg-charcoal text-ivory">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
            <div>
              <p className="text-lg font-black">كواليس الصين</p>
              <p className="mt-1 font-latin text-[10px] font-semibold tracking-[0.25em] text-gold">
                KAWALIS CHINA
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
                منصة متخصصة في التوريد من الصين للسعودية والخليج — من البحث عن المصنع
                حتى وصول الشحنة.
              </p>
              <p className="mt-3 font-latin text-xs tracking-wide text-gold/80">
                CHINA DECODED FOR THE WORLD
              </p>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold text-gold">الخدمة</p>
              <ul className="space-y-2.5 text-sm text-ivory/75">
                <li><Link href="/request" className="transition hover:text-white">طلب توريد جديد</Link></li>
                <li><Link href="/track" className="transition hover:text-white">تتبع طلب قائم</Link></li>
                <li><Link href="/#process" className="transition hover:text-white">كيف نعمل</Link></li>
                <li><Link href="/#faq" className="transition hover:text-white">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold text-gold">تواصل معنا</p>
              <ul className="space-y-2.5 text-sm text-ivory/75">
                <li>
                  <a
                    href={whatsappLink("مرحباً فريق كواليس الصين، أود الاستفسار عن خدمة التوريد.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    واتساب — الرد خلال ساعات العمل
                  </a>
                </li>
                <li className="text-ivory/50">السعودية والخليج — الصين</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50">
            © {new Date().getFullYear()} كواليس الصين — Kawalis China. جميع الحقوق محفوظة.
          </div>
        </footer>
      </body>
    </html>
  );
}
