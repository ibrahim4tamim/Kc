import Link from "next/link";

const STEPS = [
  { title: "أرسل طلبك", desc: "عبّئ تفاصيل المنتج والكمية والمواصفات في دقائق." },
  { title: "نراجع ونبحث", desc: "فريقنا يراجع طلبك ويبحث عن أفضل المصانع والموردين في الصين." },
  { title: "قارن العروض", desc: "نرسل لك عروض أسعار موثقة وقابلة للمقارنة." },
  { title: "نتابع حتى التسليم", desc: "من التفاوض والعينة حتى الشحن والوصول إليك." },
];

const FEATURES = [
  { title: "خبرة صينية حقيقية", desc: "وصول مباشر إلى المصانع والموردين، وليس وسطاء فوق وسطاء." },
  { title: "شفافية كاملة", desc: "رقم طلب فريد وتتبع واضح لكل مرحلة من مراحل التوريد." },
  { title: "عروض قابلة للمقارنة", desc: "أسعار، حد أدنى للكمية، مدة إنتاج، وشروط شحن — جنباً إلى جنب." },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8 text-center">
        <p className="mb-4 inline-block rounded-full border border-gold px-4 py-1 text-sm font-semibold text-gold">
          خدمة التوريد من الصين — للسعودية والخليج
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-snug md:text-5xl">
          تبحث عن منتج أو مصنع في <span className="text-china-red">الصين</span>؟
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/80">
          أرسل لنا تفاصيل طلبك، وسيساعدك فريق كواليس الصين في البحث عن المورد أو المصنع
          المناسب ومقارنة العروض.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/request" className="btn-primary w-full sm:w-auto">
            ابدأ طلب توريد
          </Link>
          <Link href="/track" className="btn-secondary w-full sm:w-auto">
            لدي طلب قائم
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-10 text-center text-3xl font-black">
          كيف تعمل <span className="text-gold">الخدمة</span>؟
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card text-center">
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-china-red text-xl font-black text-white">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-charcoal/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section>
        <h2 className="mb-10 text-center text-3xl font-black">
          لماذا <span className="text-china-red">كواليس الصين</span>؟
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card border-t-4 border-t-gold">
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-charcoal/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-charcoal px-6 py-14 text-center text-ivory">
        <h2 className="text-3xl font-black">جاهز تبدأ رحلة التوريد؟</h2>
        <p className="mx-auto mt-4 max-w-xl text-ivory/80">
          دقائق قليلة لتعبئة الطلب، وفريقنا يتولى الباقي — من البحث عن المصنع حتى استلام
          العروض.
        </p>
        <Link href="/request" className="btn-primary mt-8">
          ابدأ طلب توريد الآن
        </Link>
      </section>
    </div>
  );
}
