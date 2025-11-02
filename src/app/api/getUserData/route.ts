import { getUserData } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentUserId = searchParams.get("userId");
  if (!currentUserId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const userData = await getUserData(currentUserId);

  return NextResponse.json(userData);
}
