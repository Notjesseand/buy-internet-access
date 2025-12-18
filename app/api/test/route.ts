import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "hey it's there" });
}

export async function POST() {
  return NextResponse.json({ message: "hey it's there (POST works too)" });
}
