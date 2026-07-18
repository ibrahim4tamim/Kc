import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الخدمة | كواليس الصين",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black">شروط الخدمة</h1>
      <p className="mt-2 text-sm text-charcoal/50">آخر تحديث: يوليو 2026</p>

      <div className="mt-8 space-y-8 leading-relaxed text-charcoal/80">
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">نطاق الخدمة</h2>
          <p>
            كواليس الصين خدمة وساطة توريد: نبحث عن موردين في الصين، نتحقق منهم،
            نجمع عروض الأسعار ونقارنها، نتفاوض، ونتابع الإنتاج والفحص والشحن نيابة
            عنك. لسنا المصنع ولسنا البائع النهائي للبضاعة.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">العروض والأسعار</h2>
          <p>
            جميع الأسعار والمدد الواردة في العروض مقدمة من الموردين وتبقى تقديرية
            حتى تأكيد الطلب النهائي وتوقيع اتفاق الشراء. نلتزم بنقل العروض إليك
            بشفافية كما استلمناها مع ملاحظاتنا المهنية عليها.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">الدفع</h2>
          <p>
            البحث وجمع العروض والمقارنة بدون رسوم مقدمة. تُحدد الدفعات وشروطها في
            العرض الذي تعتمده قبل أي التزام مالي، ولا يُطلب منك أي مبلغ خارج ما هو
            موثق في عرضك المعتمد.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">حدود المسؤولية</h2>
          <p>
            نبذل العناية المهنية الكاملة في التحقق من الموردين ومتابعة التنفيذ،
            وتوصياتنا مبنية على المعلومات المتاحة وقت إعدادها. قرار الشراء النهائي
            واختيار العرض يعودان لك، ونوصي دائماً باعتماد العينة قبل الإنتاج الكمي.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">التواصل</h2>
          <p>لأي استفسار حول هذه الشروط، راسلنا عبر واتساب من صفحة التواصل.</p>
        </section>
      </div>
    </div>
  );
}
