import { Suspense } from "react";
import { DiscovererEntrance } from "@/components/discoverer-entrance";

export default function OntdekkerPage() {
  return (
    <Suspense fallback={<main className="discoverer-page" />}>
      <DiscovererEntrance />
    </Suspense>
  );
}
