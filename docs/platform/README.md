# وثائق الأساس لمنصة كواليس الصين V2

تجمع هذه الصفحة وثائق الأساس المعتمدة التي تحكم اتجاه المنتج، والمعمارية، والبيانات، والهوية، والتصميم، والتطوير، وسير عمل Git لمنصة كواليس الصين V2.

- **الفرع الرسمي:** `kc-platform-v2`
- **الفرع المرجعي المحفوظ:** `claude/kawalis-china-sourcing-mvp-hpz3po` — محفوظ ولا يجوز تعديله.

## ترتيب القراءة الموصى به

1. Platform Blueprint
2. Architecture
3. Data Strategy
4. Brand Guidelines
5. Design System
6. Development Rules
7. Git Workflow
8. Business Domain Model

## فهرس الوثائق

| معرّف الوثيقة | اسم الوثيقة | الغرض | الحالة | الإصدار | تاريخ الاعتماد | المسار |
|---|---|---|---|---|---|---|
| KC-V2-001 | Platform Blueprint | تحديد رؤية المنصة ونطاقها ومبادئها ومراحلها | Active | 1.0 | 2026-07-21 | [`PLATFORM_BLUEPRINT.md`](PLATFORM_BLUEPRINT.md) |
| KC-V2-002 | Architecture | تحديد المعمارية التقنية وحدود الأنظمة والأمان | Active | 1.0 | 2026-07-21 | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| KC-V2-003 | Data Strategy | تحديد ملكية البيانات وحوكمتها ودورة حياتها | Active | 1.0 | 2026-07-21 | [`DATA_STRATEGY.md`](DATA_STRATEGY.md) |
| KC-V2-004 | Brand Guidelines | تثبيت الهوية البصرية والصوت والنبرة | Active | 1.0 | 2026-07-21 | [`BRAND_GUIDELINES.md`](BRAND_GUIDELINES.md) |
| KC-V2-005 | Design System | تحويل الهوية إلى أسس وأنماط ومكوّنات قابلة للتنفيذ | Active | 1.0 | 2026-07-21 | [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) |
| KC-V2-006 | Development Rules | ضبط معايير التطوير والأمان والجودة والمراجعة | Active | 1.0 | 2026-07-21 | [`DEVELOPMENT_RULES.md`](DEVELOPMENT_RULES.md) |
| KC-V2-007 | Git Workflow | تنظيم الفروع والمراجعات والدمج والإصدارات | Active | 1.0 | 2026-07-21 | [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md) |
| KC-V2-008 | Business Domain Model | تحديد الكيانات التجارية وعلاقاتها وملكية البيانات التشغيلية | Active | 1.0 | 2026-08-01 | [`BUSINESS_DOMAIN_MODEL.md`](BUSINESS_DOMAIN_MODEL.md) |

جميع الوثائق أعلاه معتمدة من **Kawalis China (Owner)**.

## مصادر الحقيقة

- **KC Platform Dashboard** هي واجهة التشغيل الوحيدة للأنشطة التشغيلية اليومية.
- **Supabase** هو مصدر الحقيقة التشغيلي.
- **Notion** هو مصدر الحقيقة لـ KCOS وإجراءات التشغيل القياسية (SOP) والمعرفة والتوثيق والتخطيط والبحث والمراجع الإدارية فقط، وليس جزءًا من سير العمل التشغيلي اليومي.
- **GitHub** هو مصدر الحقيقة للكود، وترحيلات قواعد البيانات، والتوثيق التقني ذي الإصدارات.

## حوكمة الوثائق

أي تغيير جوهري في النطاق أو المعمارية أو البيانات أو الأمان أو العلامة التجارية يتطلب مراجعة واعتمادًا مناسبين وتحديث الوثائق المتأثرة. يجب أن يتوافق أي تنفيذ مع جميع الوثائق ذات الحالة **Active**.

هذا الطور توثيقي فقط؛ لا يصرّح بأي ترحيل إلى الإنتاج أو دمج أو نشر. كما يجب إبقاء فرع Claude المرجعي محفوظًا دون تعديل.
