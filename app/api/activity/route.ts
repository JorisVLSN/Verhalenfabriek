import { NextRequest } from "next/server";
import { children } from "@/lib/children";
import { getResidentCanon } from "@/lib/resident-canon";
import { databaseRequest, isDatabaseConfigured } from "@/lib/database";

export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) return Response.json({ configured: false });

  const { childId, residentId } = await req.json();
  if (
    !children.some((child) => child.id === childId) ||
    !getResidentCanon(residentId)
  ) {
    return Response.json({ error: "Ongeldige ontmoeting." }, { status: 400 });
  }

  await databaseRequest<unknown>("interactions", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      child_id: childId,
      resident_id: residentId,
      kind: "conversation",
    }),
  });
  return Response.json({ recorded: true });
}
