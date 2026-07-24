import { Suspense } from "react";
import { Courtyard } from "@/components/courtyard";

export default function CourtyardPage() {
  return (
    <Suspense fallback={<main className="courtyard-page" />}>
      <Courtyard />
    </Suspense>
  );
}
