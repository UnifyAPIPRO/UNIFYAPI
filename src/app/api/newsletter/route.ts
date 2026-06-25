import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // Acknowledged — integrate with email provider (Resend, Mailchimp, etc.) here
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
