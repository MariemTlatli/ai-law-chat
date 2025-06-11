// app/api/session/route.ts
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  return Response.json(session);
}