import { PrintStory } from "@/components/print-story";

interface PrintPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ child?: string }>;
}

export default async function PrintPage({
  params,
  searchParams,
}: PrintPageProps) {
  const { id } = await params;
  const { child = "" } = await searchParams;
  return <PrintStory storyId={id} childId={child} />;
}
