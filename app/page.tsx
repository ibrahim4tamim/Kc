import Link from "next/link";
import Reveal from "@/components/Reveal";

// ملاحظة للفريق: أرقام قسم الثقة placeholders — حدّثوها من هنا مباشرة.
const STATS = [
  { value: "+120", label: "مصنعاً ومورداً تم فحصهم" },
  { value: "15+", label: "قطاعاً صناعياً نغطيه" },
  { value: "24 ساعة", label: "متوسط زمن الاستجابة الأولى" },
  { value: "3", label: "شبكات موردين رئيسية في الصين" },
];

const TRUST_POINTS = [
  "التحقق من الموردين",
  "التفاوض على الأسعار",
  "متابعة الإنتاج",
  "فحص الجودة",
  "تنسيق الشحن",
];

const PROCESS_STEPS = [
  {
    title: "تقديم الطلب",
    desc: "تعبّئ نموذجاً واحداً بمواصفات منتجك والكمية والوجهة — يستغرق دقائق، وتستلم رقم متابعة فوري.",
  },
  {
    title: "البحث عن الموردين",
    desc: "نبحث في شبكاتنا ومنصات التصنيع الصينية، ونستبعد الوسطاء وغير المطابقين قبل أي تواصل.",
  },
  {
    title: "مقارنة عروض الأسعار",
    desc: "نجمع العروض في مقارنة واحدة واضحة: السعر، الحد الأدنى للكمية، مدة الإنتاج، وشروط الدفع والشحن.",
  },
  {
    title: "التفاوض",
    desc: "نتفاوض بالصينية مباشرة مع المصنع على السعر والشروط، وننقل لك النتائج أولاً بأول.",
  },
  {
    title: "متابعة الإنتاج",
    desc: "بعد اختيارك للعرض، نتابع خطوط الإنتاج والعينات والمواعيد حتى لا تتفاجأ بأي تأخير.",
  },
  {
    title: "الفحص",
    desc: "نوصي بخطة فحص مناسبة لمنتجك قبل الشحن، حتى تصلك البضاعة مطابقة لما اتفقت عليه.",
  },
  {
    title: "الشحن",
    desc: "ننسّق الشحن البحري أو الجوي أو البري حسب أولوياتك، ونتابع الشحنة حتى وصولها.",
  },
];

const WHY_ITEMS = [
  {
    title: "تواصل مباشر مع المصانع",
    desc: "نتحدث مع المصانع بلغتها ومن داخل السوق الصيني — بلا وسطاء يضيفون هوامش خفية أو معلومات منقوصة.",
  },
  {
    title: "قرارك مبني على مقارنة، لا على عرض واحد",
    desc: "لا نكتفي بأول مورد. تستلم عدة عروض موثقة جنباً إلى جنب، بأرقام واضحة قبل أي التزام مالي.",
  },
  {
    title: "شفافية في كل مرحلة",
    desc: "رقم متابعة لكل طلب، وخط زمني يوضح أين وصل طلبك بالضبط، وتحديثات مكتوبة من فريقنا — لا مكالمات ضائعة.",
  },
  {
    title: "خبرة تشغيلية، ليست نظرية",
    desc: "فريقنا يدير طلبات حقيقية يومياً: عينات، تفاوض، فحص، وشحن — ونعرف أين تقع الأخطاء المكلفة قبل وقوعها.",
  },
];

const DELIVERABLES = [
  { icon: "📊", title: "تقرير مقارنة الموردين", desc: "جدول واحد يجمع كل العروض بمعايير موحدة." },
  { icon: "✅", title: "بيانات موردين موثقة", desc: "تحقق من السجل والنشاط قبل عرض أي مورد عليك." },
  { icon: "📦", title: "تحليل الحد الأدنى للكمية", desc: "هل الـ MOQ منطقي؟ وهل يمكن تخفيضه بالتفاوض؟" },
  { icon: "💰", title: "مقارنة الأسعار", desc: "سعر الوحدة والتكلفة الإجمالية التقديرية بلا مفاجآت." },
  { icon: "🗓️", title: "الجدول الزمني للإنتاج", desc: "مدة العينة ومدة الإنتاج قبل أن تلتزم بموعد لعملائك." },
  { icon: "🚢", title: "خيارات الشحن", desc: "بحري أو جوي أو بري — بالتكلفة والمدة المتوقعة لكل خيار." },
  { icon: "🔍", title: "توصية الفحص", desc: "خطة فحص جودة مناسبة لمنتجك قبل مغادرة المصنع." },
];

const FAQ_ITEMS = [
  {
    q: "كم يستغرق التوريد؟",
    a: "البحث وجمع العروض يستغرق عادة من 3 إلى 10 أيام عمل حسب تعقيد المنتج. بعد اختيار العرض، تعتمد المدة الإجمالية على مدة الإنتاج وطريقة الشحن — ونوضح لك الجدول الزمني كاملاً في مقارنة العروض قبل أي التزام.",
  },
  {
    q: "هل تتحققون من الموردين فعلاً؟",
    a: "نعم. نفحص السجل التجاري ونشاط المصنع وتاريخه التصديري قبل إدراجه في المقارنة، ولكل مورد حالة تحقق موثقة في نظامنا. لا نعرض عليك مورداً لم نفحصه.",
  },
  {
    q: "هل يمكنكم التفاوض على الأسعار؟",
    a: "التفاوض جزء أساسي من الخدمة. نتفاوض مع المصنع مباشرة بالصينية على السعر والحد الأدنى للكمية وشروط الدفع، وننقل لك كل تحسن في العرض ضمن صفحة متابعة طلبك.",
  },
  {
    q: "هل أستطيع طلب عينة قبل الالتزام؟",
    a: "نعم، وننصح بها لأغلب المنتجات. نرتب لك عينة من المصنع المرشح مع توضيح تكلفتها ومدتها، ولا ننتقل للإنتاج الكمي إلا بعد اعتمادك للعينة.",
  },
  {
    q: "هل تخدمون السعودية؟",
    a: "السعودية هي سوقنا الأساسي، ونخدم دول الخليج كافة. نعرف متطلبات الاستيراد والجمارك السعودية ونجهز الشحنات وفقاً لها.",
  },
  {
    q: "هل تشحنون دولياً خارج الخليج؟",
    a: "تركيزنا الحالي على السعودية والخليج لضمان جودة الخدمة. للوجهات الأخرى، راسلنا عبر واتساب وسنخبرك بصدق إن كنا نستطيع خدمتك بالمستوى نفسه.",
  },
];

const DASHBOARD_TIMELINE = [
  { label: "تم استلام الطلب", state: "done" },
  { label: "تمت مراجعة الطلب", state: "done" },
  { label: "تم العثور على موردين", state: "done" },
  { label: "جاري جمع عروض الأسعار", state: "current" },
  { label: "إرسال العروض إليك", state: "upcoming" },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* ===== Hero ===== */}
      <section className="relative">
        {/* خلفية تحريرية هادئة: توهج ذهبي + خطوط لوجستية */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute top-40 -right-24 h-64 w-64 rounded-full bg-china-red/[0.05] blur-3xl" />
          <svg
            className="absolute inset-x-0 top-24 mx-auto w-full max-w-5xl opacity-[0.14]"
            viewBox="0 0 800 300"
            fill="none"
          >
            <path d="M-20 220 C 180 140, 340 260, 520 160 S 760 80, 840 140" stroke="#C9A24A" strokeWidth="1.4" strokeDasharray="6 8" />
            <path d="M-20 120 C 200 60, 420 180, 620 90 S 780 30, 840 70" stroke="#CC2828" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="520" cy="160" r="4" fill="#C9A24A" />
            <circle cx="200" cy="97" r="3" fill="#CC2828" />
          </svg>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center md:pb-24 md:pt-24">
          <Reveal>
            <p className="section-label">التوريد من الصين — للسعودية والخليج</p>
            <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black leading-[1.35] md:text-5xl md:leading-[1.3]">
              نجد لك المصنع المناسب في الصين،
              <br />
              وندير التوريد <span className="text-china-red">حتى تصلك شحنتك</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              فريقنا يتحقق من الموردين، يقارن العروض، يتفاوض على الأسعار، ويتابع
              الإنتاج والفحص والشحن — حتى لا تضطر أنت لذلك.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/request" className="btn-primary w-full sm:w-auto">
                ابدأ طلب توريد
              </Link>
              <Link href="/track" className="btn-secondary w-full sm:w-auto">
                تتبع طلباً قائماً
              </Link>
            </div>
            <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-charcoal/60">
              {TRUST_POINTS.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="text-gold">✓</span> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== شريط الإحصائيات ===== */}
      <section className="border-y border-charcoal/[0.06] bg-white/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <p className="font-latin text-3xl font-bold text-charcoal md:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-charcoal/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== كيف نعمل — Timeline ===== */}
      <section id="process" className="mx-auto max-w-4xl px-4 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="section-label">منهجية العمل</p>
          <h2 className="section-title">
            سبع خطوات، بشفافية <span className="text-gold-deep">كاملة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
            كل خطوة موثقة في نظام المتابعة، وتعرف دائماً أين وصل طلبك.
          </p>
        </Reveal>

        <ol className="relative mt-14 space-y-0">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
              <li className="relative flex gap-5 pb-10 last:pb-0">
                {/* الخط الواصل */}
                {i < PROCESS_STEPS.length - 1 && (
                  <span aria-hidden className="absolute right-[22px] top-12 h-full w-px bg-gradient-to-b from-gold/60 to-gold/10" />
                )}
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-ivory font-latin text-sm font-bold text-gold-deep shadow-sm">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1.5 max-w-xl leading-relaxed text-charcoal/70">{step.desc}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ===== لماذا كواليس الصين ===== */}
      <section id="why" className="bg-white/60 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p className="section-label">لماذا نحن</p>
            <h2 className="section-title">
              قيمة ملموسة، لا <span className="text-china-red">شعارات</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WHY_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="card card-lift h-full border-t-2 border-t-gold/70">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-charcoal/70">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ماذا تستلم ===== */}
      <section id="deliverables" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="section-label">مخرجات الخدمة</p>
          <h2 className="section-title">
            ماذا تستلم <span className="text-gold-deep">بالضبط</span>؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
            ليست وعوداً عامة — هذه المخرجات الفعلية التي تصلك خلال رحلة طلبك.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d.title} delay={(i % 3) * 80}>
              <div className="card card-lift h-full">
                <span className="text-2xl">{d.icon}</span>
                <h3 className="mt-3 font-bold">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== معاينة لوحة المتابعة ===== */}
      <section className="bg-white/60 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <p className="section-label">الشفافية أولاً</p>
            <h2 className="section-title">
              تعرف أين وصل طلبك — <span className="text-china-red">دائماً</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-charcoal/70">
              لكل طلب رقم متابعة خاص وصفحة تتبع محمية برقم جوالك. ترى حالة الطلب،
              وخطاً زمنياً لكل مرحلة، وتحديثات مكتوبة من الفريق، والعروض المعتمدة
              للمقارنة — وتتخذ قرارك من نفس الصفحة.
            </p>
            <Link href="/track" className="btn-secondary mt-8">
              جرّب صفحة التتبع
            </Link>
          </Reveal>

          {/* موك-أب لوحة التتبع */}
          <Reveal delay={120}>
            <div className="rounded-2xl border border-charcoal/[0.08] bg-charcoal/[0.03] p-3 shadow-card">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-latin text-xs font-bold tracking-wide text-gold-deep">
                      KC-RFQ-2026-58146
                    </p>
                    <p className="mt-1 text-lg font-black">كراسي مكتب طبية</p>
                  </div>
                  <span className="rounded-full bg-china-red px-3.5 py-1 text-xs font-bold text-white">
                    جاري جمع عروض الأسعار
                  </span>
                </div>
                <ol className="mt-6 space-y-3.5">
                  {DASHBOARD_TIMELINE.map((s) => (
                    <li key={s.label} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          s.state === "done"
                            ? "bg-green-600 text-white"
                            : s.state === "current"
                              ? "bg-china-red text-white ring-4 ring-china-red/15"
                              : "border border-charcoal/25 text-charcoal/40"
                        }`}
                      >
                        {s.state === "done" ? "✓" : s.state === "current" ? "●" : ""}
                      </span>
                      <span
                        className={
                          s.state === "current"
                            ? "font-bold text-china-red"
                            : s.state === "done"
                              ? "text-charcoal/75"
                              : "text-charcoal/40"
                        }
                      >
                        {s.label}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 rounded-lg bg-ivory p-3.5 text-xs leading-relaxed text-charcoal/70">
                  <span className="font-bold text-gold-deep">تحديث الفريق: </span>
                  تواصلنا مع 6 مصانع مطابقة، واستلمنا عرضين حتى الآن. المقارنة الكاملة
                  تصلك خلال يومي عمل.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== الأسئلة الشائعة ===== */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="section-label">قبل أن تبدأ</p>
          <h2 className="section-title">الأسئلة الشائعة</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="faq-item card !p-0">
                <summary className="flex items-center justify-between gap-4 px-6 py-5">
                  <span className="font-bold">{item.q}</span>
                  <span className="faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold-deep">
                    +
                  </span>
                </summary>
                <p className="border-t border-charcoal/[0.06] px-6 py-5 leading-relaxed text-charcoal/70">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== القسم الختامي ===== */}
      <section className="px-4 pb-20 md:pb-28">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-charcoal px-6 py-16 text-center text-ivory md:py-24">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-72 w-[560px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-china-red/10 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-black leading-snug md:text-4xl">
                جاهز تستورد <span className="text-gold">بثقة</span>؟
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ivory/75">
                من البحث عن المصنع حتى تسليم الشحنة — فريقنا يدير كل خطوة بشفافية
                ودقة، وأنت تتابع كل شيء برقم طلبك.
              </p>
              <Link
                href="/request"
                className="btn-primary mt-9 !bg-china-red hover:!bg-[#b32222]"
              >
                ابدأ طلب التوريد الآن
              </Link>
              <p className="mt-4 text-xs text-ivory/50">
                بدون أي التزام مالي — تدفع فقط عندما تختار عرضاً وتؤكد طلبك.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA ثابت أسفل الشاشة — جوال فقط */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-ivory/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link href="/request" className="btn-primary w-full !py-3.5">
          ابدأ طلب توريد
        </Link>
      </div>
      {/* مسافة حتى لا يغطي الشريط الثابت الفوتر على الجوال */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
