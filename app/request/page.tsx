import type { Metadata } from "next";
import RequestForm from "@/components/RequestForm";

export const metadata: Metadata = {
  title: "طلب توريد جديد | كواليس الصين",
};

export default function RequestPage() {
  return <RequestForm />;
}
