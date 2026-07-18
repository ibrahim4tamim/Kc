import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | كواليس الصين",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black">سياسة الخصوصية</h1>
      <p className="mt-2 text-sm text-charcoal/50">آخر تحديث: يوليو 2026</p>

      <div className="mt-8 space-y-8 leading-relaxed text-charcoal/80">
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">ما البيانات التي نجمعها؟</h2>
          <p>
            عند إرسال طلب توريد نجمع فقط ما تدخله في النموذج: اسمك، وسائل التواصل
            (الجوال، الواتساب، البريد)، اسم شركتك إن وجدت، وتفاصيل المنتج المطلوب
            وصوره وبيانات الشحن.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">لماذا نجمعها؟</h2>
          <p>
            لغرض واحد: تنفيذ طلب التوريد الخاص بك — التواصل معك، البحث عن الموردين
            المناسبين، وإرسال العروض إليك. لا نستخدم بياناتك لأي غرض تسويقي دون
            موافقتك.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">من يطّلع على بياناتك؟</h2>
          <p>
            فريق كواليس الصين فقط. عند التواصل مع المصانع نشارك <strong>مواصفات
            المنتج فقط</strong> — لا نشارك اسمك أو بيانات تواصلك مع أي مورد. لا نبيع
            بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تجارية.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">أين تُخزن البيانات؟</h2>
          <p>
            في نظام إدارة الطلبات الداخلي الخاص بنا، خلف طبقة حماية تتطلب رقم الطلب
            مع رقم جوالك أو بريدك للاطلاع على أي معلومة عبر الموقع.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-charcoal">حقوقك</h2>
          <p>
            يمكنك في أي وقت طلب تعديل بياناتك أو حذف طلبك بالكامل بمراسلتنا عبر
            واتساب برقم طلبك.
          </p>
        </section>
      </div>
    </div>
  );
}
