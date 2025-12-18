// api/create-user/route.ts
import { NextResponse } from "next/server";
import { createHotspotUser } from "@/backend/mikrotik";

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    // MATCHING YOUR SCREENSHOTS EXACTLY
    const profileMap: Record<string, string> = {
      "Quick Surf": "QUICK_SURF",
      "Daily Access": "DAILY_ACCESS",
      "Weekly Connect": "WEEKLY_CONNECT",
      "Power User": "POWER_USER",
      "Monthly Pro": "MONTHLY_PRO",
    };

    const selectedProfile = profileMap[plan] || "default";

    // Generate simple credentials
    const username =
      email.split("@")[0].toLowerCase() + Math.floor(10 + Math.random() * 89);
    const password = Math.floor(1000 + Math.random() * 9000).toString();

    const success = await createHotspotUser({
      username,
      password,
      profile: selectedProfile,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        credentials: { username, password },
      });
    }
    throw new Error("Router rejected user creation");
  } catch (error: any) {
    console.error("Creation Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}