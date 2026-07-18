import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// فحص ذاتي للتشخيص: يكشف حالة الإعداد بدون أي بيانات حساسة —
// لا يُرجع مفاتيح ولا محتوى قواعد، فقط "يعمل / لا يعمل + كود الخطأ".

const DBS: [string, string][] = [
  ["requests", "NOTION_REQUESTS_DATABASE_ID"],
  ["suppliers", "NOTION_SUPPLIERS_DATABASE_ID"],
  ["quotes", "NOTION_QUOTES_DATABASE_ID"],
  ["communications", "NOTION_COMMUNICATIONS_DATABASE_ID"],
];

export async function GET() {
  const env = {
    NOTION_API_KEY: !!process.env.NOTION_API_KEY,
    NOTION_REQUESTS_DATABASE_ID: !!process.env.NOTION_REQUESTS_DATABASE_ID,
    NOTION_SUPPLIERS_DATABASE_ID: !!process.env.NOTION_SUPPLIERS_DATABASE_ID,
    NOTION_QUOTES_DATABASE_ID: !!process.env.NOTION_QUOTES_DATABASE_ID,
    NOTION_COMMUNICATIONS_DATABASE_ID: !!process.env.NOTION_COMMUNICATIONS_DATABASE_ID,
    WHATSAPP_NUMBER: !!process.env.WHATSAPP_NUMBER,
  };

  const checks: Record<string, string> = {};

  if (!env.NOTION_API_KEY) {
    return NextResponse.json({ env, checks: { fatal: "NOTION_API_KEY missing at runtime" } });
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  for (const [label, envVar] of DBS) {
    const id = process.env[envVar];
    if (!id) {
      checks[label] = "missing env var";
      continue;
    }
    try {
      await notion.databases.retrieve({ database_id: id });
      checks[label] = "ok";
    } catch (err: any) {
      checks[label] = `error: ${err?.code ?? "unknown"} (${err?.status ?? "?"})`;
    }
  }

  return NextResponse.json({ env, checks });
}
