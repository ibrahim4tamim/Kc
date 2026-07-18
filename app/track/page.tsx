import type { Metadata } from "next";
import { Suspense } from "react";
import TrackView from "@/components/TrackView";

export const metadata: Metadata = {
  title: "تتبع حالة الطلب | كواليس الصين",
};

export default function TrackPage() {
  return (
    <Suspense>
      <TrackView />
    </Suspense>
  );
}
