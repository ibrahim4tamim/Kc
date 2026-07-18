# إعداد Notion — كواليس الصين Sourcing MVP

هذا الدليل يشرح خطوة بخطوة كيف تجهّز Notion ليكون نظام التشغيل الداخلي
(Single Source of Truth) لطلبات التوريد.

> **مهم:** أسماء الخصائص (Properties) يجب أن تُكتب **حرفياً كما هي هنا وبالإنجليزية**،
> لأن الكود يخاطب Notion بهذه الأسماء. قيم الخيارات (Select options) تُكتب بالعربية كما هي.

---

## 1) إنشاء التكامل (Integration) والحصول على مفتاح API

1. افتح: https://www.notion.so/my-integrations
2. اضغط **+ New integration**.
3. الاسم: `Kawalis China Website`، واختر الـ Workspace الخاص بك.
4. Capabilities المطلوبة: **Read content**, **Insert content**, **Update content**.
5. اضغط Submit ثم انسخ **Internal Integration Secret** — هذا هو `NOTION_API_KEY`.

## 2) إنشاء قواعد البيانات الأربع

أنشئ صفحة رئيسية باسم مثلاً **"كواليس الصين — نظام التوريد"**، وبداخلها
أنشئ 4 قواعد بيانات (Full-page databases):

1. **Sourcing Requests** — الطلبات (القاعدة المركزية)
2. **Suppliers** — الموردون
3. **Quotations** — عروض الأسعار
4. **Communications** — التواصل

### خريطة العلاقات

```
                    ┌──────────────────┐
                    │ Sourcing Requests │  ← مركز النظام
                    └───┬────┬────┬────┘
          Suppliers ────┘    │    └──── Communications
        (many-to-many)       │            (one request → many)
                             │
                        Quotations
                  (one request → many quotes)
                             │
                        Suppliers
                  (each quote → one supplier)
```

- كل **طلب** يرتبط بعدة موردين، عدة عروض أسعار، وعدة سجلات تواصل.
- كل **عرض سعر** يتبع طلباً واحداً ومورداً واحداً.
- كل **مورد** يُسجل مرة واحدة فقط ويُعاد ربطه بطلبات متعددة.

---

## 3) قاعدة 1 — Sourcing Requests

| Property (بالحرف) | النوع في Notion | ملاحظات |
|---|---|---|
| `Request ID` | **Title** | رقم الطلب KC-RFQ-2026-XXXXX |
| `Customer Name` | Text (rich_text) | |
| `Mobile` | Phone | |
| `WhatsApp` | Phone | |
| `Email` | Email | |
| `Company` | Text | |
| `Preferred Contact Method` | Select | خيارات: `واتساب`، `اتصال`، `بريد إلكتروني` |
| `Product Name` | Text | |
| `Product Category` | Select | `الأثاث`، `المنزل الذكي`، `الإلكترونيات`، `مواد البناء`، `الملابس والمنسوجات`، `التغليف`، `المعدات`، `منتجات مخصصة`، `أخرى` |
| `Product Description` | Text | |
| `Product Images` | Files & media | روابط خارجية من مخزن الملفات |
| `Product Reference URL` | URL | |
| `Quantity` | Number | |
| `Unit` | Select | `قطعة`، `كرتون`، `طن`، `متر`، `حاوية`، `أخرى` |
| `Target Budget` | Number | |
| `Target Price Per Unit` | Number | |
| `Currency` | Select | `SAR`، `USD`، `CNY` |
| `Customization Required` | Select | `نعم`، `لا`، `غير متأكد` |
| `Private Label Required` | Select | `نعم`، `لا`، `غير متأكد` |
| `Packaging Customization` | Select | `نعم`، `لا`، `غير متأكد` |
| `Customization Details` | Text | |
| `Destination Country` | Text | |
| `Destination City` | Text | |
| `Shipping Preference` | Select | `بحري`، `جوي`، `بري`، `غير متأكد` |
| `Required Delivery Date` | Date | |
| `Additional Notes` | Text | |
| `Status` | Select | الحالات الـ 24 أدناه |
| `Priority` | Select | مثلاً: `عالية`، `متوسطة`، `منخفضة` |
| `Assigned To` | Person | المسؤول من الفريق |
| `Source` | Select | `Website`، `WhatsApp`، `Referral`، `Other` |
| `Created Date` | Date | يعبأ تلقائياً من الموقع |
| `Last Updated` | Date | يعبأ تلقائياً |
| `Next Follow-up Date` | Date | للفريق |
| `Internal Notes` | Text | **داخلي — لا يظهر للعميل أبداً** |
| `Customer Visible Update` | Text | **هذا فقط ما يظهر للعميل في صفحة التتبع** |
| `Selected Supplier` | Relation → Suppliers | المورد المختار نهائياً |
| `Selected Quotation` | Relation → Quotations | العرض المختار نهائياً |
| `Suppliers` | Relation → Suppliers | الموردون المرشحون |
| `Quotations` | Relation → Quotations | |
| `Communications` | Relation → Communications | |

### خيارات خاصية Status (انسخها حرفياً)

```
01 — طلب جديد
02 — قيد المراجعة
03 — بانتظار معلومات من العميل
04 — جاري البحث عن مورد
05 — تم العثور على موردين
06 — جاري طلب عروض الأسعار
07 — تم استلام عروض الأسعار
08 — جاري مراجعة العروض
09 — تم إرسال العروض للعميل
10 — بانتظار قرار العميل
11 — جاري التفاوض
12 — تم اختيار المورد
13 — بانتظار الدفعة
14 — تم تأكيد الطلب
15 — جاري أخذ العينة
16 — تم اعتماد العينة
17 — قيد التصنيع
18 — فحص الجودة
19 — جاهز للشحن
20 — تم الشحن
21 — تم التسليم
22 — مكتمل
23 — متوقف مؤقتاً
24 — ملغي
```

> الشرطة في الحالات هي **em-dash (—)** وليست شرطة عادية. انسخ القائمة كما هي.

---

## 4) قاعدة 2 — Suppliers

| Property | النوع | ملاحظات |
|---|---|---|
| `Supplier ID` | **Title** | مثلاً SUP-0001 |
| `Supplier Name` | Text | |
| `Supplier Name Chinese` | Text | |
| `Supplier Type` | Select | `Factory`، `Trading Company`، `Distributor`، `Unknown` |
| `Country` | Text | |
| `Province` | Text | |
| `City` | Text | |
| `Contact Person` | Text | **داخلي** |
| `Phone` | Phone | **داخلي** |
| `WeChat` | Text | **داخلي** |
| `Email` | Email | **داخلي** |
| `Website` | URL | |
| `Alibaba URL` | URL | |
| `1688 URL` | URL | |
| `Other Platform URL` | URL | |
| `Main Product Category` | Select | نفس فئات المنتجات |
| `Products` | Text | |
| `MOQ` | Number | |
| `Years in Business` | Number | |
| `Verification Status` | Select | `غير متحقق`، `قيد التحقق`، `تم التحقق`، `مرفوض` |
| `Supplier Rating` | Select | `⭐`…`⭐⭐⭐⭐⭐` |
| `Quality Rating` | Select | نفس النجوم |
| `Price Rating` | Select | نفس النجوم |
| `Communication Rating` | Select | نفس النجوم |
| `Delivery Rating` | Select | نفس النجوم |
| `Internal Notes` | Text | **داخلي** |
| `Related Requests` | Relation → Sourcing Requests | |
| `Related Quotations` | Relation → Quotations | |
| `Created Date` | Date | |
| `Last Updated` | Date | |

---

## 5) قاعدة 3 — Quotations

| Property | النوع | ملاحظات |
|---|---|---|
| `Quotation ID` | **Title** | مثلاً Q-KC-RFQ-2026-84721-01 |
| `Request` | Relation → Sourcing Requests | **إلزامي للكود** |
| `Supplier` | Relation → Suppliers | |
| `Product` | Text | |
| `Unit Price` | Number | |
| `Currency` | Select | `SAR`، `USD`، `CNY` |
| `MOQ` | Number | |
| `Requested Quantity` | Number | |
| `Total Product Cost` | Number | |
| `Sample Cost` | Number | |
| `Tooling Cost` | Number | |
| `Customization Cost` | Number | |
| `Packaging Cost` | Number | |
| `Estimated Shipping Cost` | Number | |
| `Other Costs` | Number | |
| `Estimated Total Cost` | Number | يظهر للعميل |
| `Production Lead Time` | Text | مثلاً "25-30 يوم" |
| `Sample Lead Time` | Text | |
| `Payment Terms` | Text | |
| `Incoterm` | Select | `EXW`، `FOB`، `CIF`، `DDP`، `Other` |
| `Quotation Valid Until` | Date | |
| `Quotation File` | Files & media | |
| `Supplier Original Quote` | Files & media | **داخلي** |
| `Internal Notes` | Text | **داخلي** |
| `Customer Visible Notes` | Text | يظهر للعميل |
| `Negotiation Status` | Select | `عرض أولي`، `قيد التفاوض`، `عرض نهائي`، `مقبول`، `مرفوض` |
| `Customer Decision` | Select | `لم يراجع`، `قيد المراجعة`، `مهتم`، `يحتاج تفاوض`، `مقبول`، `مرفوض` |
| `Is Selected Quote` | Checkbox | |
| `Approved For Customer` | Checkbox | **البوابة الأمنية: العرض لا يظهر للعميل إلا إذا فُعّل** |
| `Created Date` | Date | |
| `Last Updated` | Date | |

> `Approved For Customer` إضافة معمارية مقصودة: بدلاً من الاعتماد على حالة التفاوض،
> الفريق يقرر صراحةً متى يصبح العرض مرئياً للعميل بضغطة واحدة.

---

## 6) قاعدة 4 — Communications

| Property | النوع | ملاحظات |
|---|---|---|
| `Communication ID` | **Title** | يولّد تلقائياً |
| `Request` | Relation → Sourcing Requests | |
| `Customer` | Text | |
| `Communication Type` | Select | `WhatsApp`، `Phone`، `Email`، `Website`، `Meeting`، `Other` |
| `Direction` | Select | `Inbound`، `Outbound` |
| `Communication Date` | Date | |
| `Subject` | Text | |
| `Summary` | Text | |
| `Full Notes` | Text | |
| `Team Member` | Text | |
| `Customer Response` | Text | |
| `Next Action` | Text | |
| `Next Follow-up Date` | Date | |
| `Attachment` | Files & media | |
| `Created Date` | Date | |

---

## 7) إنشاء العلاقات (Relations)

عند إضافة خاصية Relation:

1. أضف Property جديدة → النوع **Relation**.
2. اختر قاعدة البيانات الهدف.
3. فعّل **Show on [الهدف]** ليظهر الارتباط في الاتجاهين، وسمِّ الخاصية العكسية
   بالاسم المطلوب في الجدول (مثلاً في Suppliers تكون العكسية `Related Requests`).

أنشئ العلاقات بهذا الترتيب لتجنب الازدواج:

1. من **Quotations**: `Request` → Sourcing Requests (العكسية: `Quotations`)
2. من **Quotations**: `Supplier` → Suppliers (العكسية: `Related Quotations`)
3. من **Sourcing Requests**: `Suppliers` → Suppliers (العكسية: `Related Requests`)
4. من **Communications**: `Request` → Sourcing Requests (العكسية: `Communications`)
5. من **Sourcing Requests**: `Selected Supplier` → Suppliers (بدون عكسية ظاهرة)
6. من **Sourcing Requests**: `Selected Quotation` → Quotations (بدون عكسية ظاهرة)

## 8) الـ Rollups المقترحة (اختيارية)

في **Sourcing Requests**:
- `Quotes Count`: Rollup على `Quotations` → أي خاصية → **Count**.
- `Best Unit Price`: Rollup على `Quotations` → `Unit Price` → **Min**.

في **Suppliers**:
- `Quotes Given`: Rollup على `Related Quotations` → Count.

## 9) ربط التكامل بالقواعد

**بدون هذه الخطوة سيفشل كل شيء بخطأ 404.**

لكل قاعدة من القواعد الأربع:
1. افتح القاعدة كصفحة كاملة.
2. قائمة `•••` أعلى اليسار → **Connections** → **Connect to** → اختر `Kawalis China Website`.

(ربط الصفحة الأم يكفي إذا كانت القواعد كلها بداخلها.)

## 10) الحصول على Database IDs

افتح كل قاعدة في المتصفح كصفحة كاملة. الرابط يكون:

```
https://www.notion.so/workspace/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d?v=...
                              └────────── Database ID ──────────┘
```

الـ ID هو المقطع 32 خانة قبل `?v=`. انسخه (مع أو بدون الشرطات — كلاهما يعمل)
وضعه في `.env.local`:

```
NOTION_API_KEY=secret_xxx
NOTION_REQUESTS_DATABASE_ID=...
NOTION_SUPPLIERS_DATABASE_ID=...
NOTION_QUOTES_DATABASE_ID=...
NOTION_COMMUNICATIONS_DATABASE_ID=...
```

## 11) اختبار الإعداد

```bash
npm run validate:notion
```

السكربت يفحص الاتصال وكل خاصية ونوعها ويطبع تقريراً — **قراءة فقط،
لا يعدّل ولا يحذف شيئاً**. أصلح ما يظهر من أخطاء ثم أعد التشغيل حتى ترى:

```
✓ إعداد Notion سليم — النظام جاهز للعمل.
```

ثم جرّب من الموقع: أرسل طلباً تجريبياً وتأكد من ظهوره في Sourcing Requests
مع سجل جديد في Communications.

## 12) حل المشاكل الشائعة

| الخطأ | السبب | الحل |
|---|---|---|
| `401 unauthorized` | مفتاح API خاطئ | انسخ الـ Secret من صفحة التكامل من جديد |
| `404 object_not_found` | التكامل غير مربوط بالقاعدة، أو ID خاطئ | راجع الخطوتين 9 و10 |
| `400 validation_error: property does not exist` | اسم خاصية مختلف عن الجدول | طابق الاسم حرفياً (حساس لحالة الأحرف والمسافات) |
| `400 select option does not exist` | Notion ينشئ خيارات Select تلقائياً عند الكتابة — هذا الخطأ نادر | تأكد أن الخاصية من نوع Select وليس Status |
| `409 conflict_error` | تعديل متزامن | أعد المحاولة — الكود يتعامل معها |
| `rate_limited` | أكثر من 3 طلبات/ثانية | انتظر ثم أعد المحاولة |

---

## العروض للعميل — سير العمل المختصر

1. الفريق يضيف عرضاً في Quotations ويربطه بالطلب والمورد.
2. يكتب ملاحظة للعميل في `Customer Visible Notes` (بدون أي أسعار داخلية أو هوامش).
3. عندما يصبح العرض جاهزاً: يفعّل ✅ `Approved For Customer`.
4. يغيّر حالة الطلب إلى `09 — تم إرسال العروض للعميل`.
5. العميل يرى العرض في صفحة التتبع ويرد (مهتم / تعديل / تفاوض / اختيار).
6. رد العميل يُسجل تلقائياً في `Customer Decision` وفي Communications،
   وعند الاختيار تتحول حالة الطلب تلقائياً إلى `12 — تم اختيار المورد`.
