import { NextResponse } from "next/server";
import { createInsforgeAuthActions } from "@/lib/insforge-server";

export async function POST() {
  const auth = await createInsforgeAuthActions();
  const { error } = await auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
