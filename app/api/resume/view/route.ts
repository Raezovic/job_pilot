import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    if (!user || authError) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storagePath = `${user.id}/resume.pdf`;

    // Create a time-limited signed URL for private bucket access (1 hour)
    const { data: signedData, error: signedError } = await insforge.storage
      .from("resumes")
      .createSignedUrl(storagePath, 3600);

    if (signedError || !signedData?.signedUrl) {
      return new NextResponse("Resume file not found or inaccessible.", { status: 404 });
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch (error) {
    console.error("[api/resume/view]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
