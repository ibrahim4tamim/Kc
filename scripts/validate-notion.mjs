// فحص إعداد قواعد Notion — للقراءة فقط، لا يعدّل ولا يحذف أي بيانات.
// الاستخدام: npm run validate:notion  (بعد تعبئة .env.local)
//
// يتحقق من:
//  1. وجود متغيرات البيئة المطلوبة.
//  2. إمكانية الوصول لكل قاعدة بيانات بالمفتاح المعطى.
//  3. وجود كل خاصية مطلوبة وبالنوع الصحيح.

import { readFileSync, existsSync } from "node:fs";

// تحميل .env.local يدوياً (بدون تبعيات إضافية)
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

const NOTION_VERSION = "2022-06-28";

const SCHEMAS = {
  NOTION_REQUESTS_DATABASE_ID: {
    label: "Sourcing Requests",
    properties: {
      "Request ID": "title",
      "Customer Name": "rich_text",
      Mobile: "phone_number",
      WhatsApp: "phone_number",
      Email: "email",
      Company: "rich_text",
      "Preferred Contact Method": "select",
      "Product Name": "rich_text",
      "Product Category": "select",
      "Product Description": "rich_text",
      "Product Images": "files",
      "Product Reference URL": "url",
      Quantity: "number",
      Unit: "select",
      "Target Budget": "number",
      "Target Price Per Unit": "number",
      Currency: "select",
      "Customization Required": "select",
      "Private Label Required": "select",
      "Packaging Customization": "select",
      "Customization Details": "rich_text",
      "Destination Country": "rich_text",
      "Destination City": "rich_text",
      "Shipping Preference": "select",
      "Required Delivery Date": "date",
      "Additional Notes": "rich_text",
      Status: "select",
      Priority: "select",
      Source: "select",
      "Created Date": "date",
      "Last Updated": "date",
      "Next Follow-up Date": "date",
      "Internal Notes": "rich_text",
      "Customer Visible Update": "rich_text",
      Suppliers: "relation",
      Quotations: "relation",
      Communications: "relation",
    },
  },
  NOTION_SUPPLIERS_DATABASE_ID: {
    label: "Suppliers",
    properties: {
      "Supplier ID": "title",
      "Supplier Name": "rich_text",
      "Supplier Name Chinese": "rich_text",
      "Supplier Type": "select",
      Country: "rich_text",
      Province: "rich_text",
      City: "rich_text",
      "Contact Person": "rich_text",
      Phone: "phone_number",
      WeChat: "rich_text",
      Email: "email",
      Website: "url",
      "Alibaba URL": "url",
      "1688 URL": "url",
      "Other Platform URL": "url",
      "Main Product Category": "select",
      Products: "rich_text",
      MOQ: "number",
      "Years in Business": "number",
      "Verification Status": "select",
      "Supplier Rating": "select",
      "Quality Rating": "select",
      "Price Rating": "select",
      "Communication Rating": "select",
      "Delivery Rating": "select",
      "Internal Notes": "rich_text",
      "Related Requests": "relation",
      "Related Quotations": "relation",
      "Created Date": "date",
      "Last Updated": "date",
    },
  },
  NOTION_QUOTES_DATABASE_ID: {
    label: "Quotations",
    properties: {
      "Quotation ID": "title",
      Request: "relation",
      Supplier: "relation",
      Product: "rich_text",
      "Unit Price": "number",
      Currency: "select",
      MOQ: "number",
      "Requested Quantity": "number",
      "Total Product Cost": "number",
      "Sample Cost": "number",
      "Tooling Cost": "number",
      "Customization Cost": "number",
      "Packaging Cost": "number",
      "Estimated Shipping Cost": "number",
      "Other Costs": "number",
      "Estimated Total Cost": "number",
      "Production Lead Time": "rich_text",
      "Sample Lead Time": "rich_text",
      "Payment Terms": "rich_text",
      Incoterm: "select",
      "Quotation Valid Until": "date",
      "Quotation File": "files",
      "Supplier Original Quote": "files",
      "Internal Notes": "rich_text",
      "Customer Visible Notes": "rich_text",
      "Negotiation Status": "select",
      "Customer Decision": "select",
      "Is Selected Quote": "checkbox",
      "Approved For Customer": "checkbox",
      "Created Date": "date",
      "Last Updated": "date",
    },
  },
  NOTION_COMMUNICATIONS_DATABASE_ID: {
    label: "Communications",
    properties: {
      "Communication ID": "title",
      Request: "relation",
      Customer: "rich_text",
      "Communication Type": "select",
      Direction: "select",
      "Communication Date": "date",
      Subject: "rich_text",
      Summary: "rich_text",
      "Full Notes": "rich_text",
      "Team Member": "rich_text",
      "Customer Response": "rich_text",
      "Next Action": "rich_text",
      "Next Follow-up Date": "date",
      Attachment: "files",
      "Created Date": "date",
    },
  },
};

const apiKey = process.env.NOTION_API_KEY;
if (!apiKey) {
  console.error("✗ NOTION_API_KEY غير موجود في .env.local");
  process.exit(1);
}

let hasErrors = false;

async function fetchDatabase(id) {
  const res = await fetch(`https://api.notion.com/v1/databases/${id}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`${res.status} ${body.code ?? ""} ${body.message ?? ""}`.trim());
  }
  return res.json();
}

for (const [envVar, schema] of Object.entries(SCHEMAS)) {
  const dbId = process.env[envVar];
  console.log(`\n▶ ${schema.label} (${envVar})`);

  if (!dbId || dbId.startsWith("xxxx")) {
    console.error(`  ✗ ${envVar} غير معبأ في .env.local`);
    hasErrors = true;
    continue;
  }

  let db;
  try {
    db = await fetchDatabase(dbId);
  } catch (err) {
    console.error(`  ✗ تعذر الوصول للقاعدة: ${err.message}`);
    console.error(`    تأكد من صحة الـ ID ومن ربط التكامل بالقاعدة (Connections → أضف تكاملك).`);
    hasErrors = true;
    continue;
  }

  console.log(`  ✓ متصل: "${db.title?.[0]?.plain_text ?? "بدون عنوان"}"`);

  const actual = db.properties ?? {};
  let missing = 0;
  let wrongType = 0;
  for (const [propName, expectedType] of Object.entries(schema.properties)) {
    const prop = actual[propName];
    if (!prop) {
      console.error(`  ✗ خاصية مفقودة: "${propName}" (النوع المطلوب: ${expectedType})`);
      missing++;
    } else if (prop.type !== expectedType) {
      console.error(
        `  ✗ نوع خاطئ: "${propName}" — الموجود: ${prop.type}، المطلوب: ${expectedType}`
      );
      wrongType++;
    }
  }
  if (missing === 0 && wrongType === 0) {
    console.log(`  ✓ جميع الخصائص (${Object.keys(schema.properties).length}) موجودة وبالأنواع الصحيحة`);
  } else {
    hasErrors = true;
    console.error(`  → ${missing} خاصية مفقودة، ${wrongType} بنوع خاطئ. راجع NOTION_SETUP.md`);
  }
}

console.log("");
if (hasErrors) {
  console.error("✗ الإعداد غير مكتمل — راجع الأخطاء أعلاه ثم أعد التشغيل.");
  process.exit(1);
} else {
  console.log("✓ إعداد Notion سليم — النظام جاهز للعمل.");
}
