import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 8) return null;
  return pw;
}

export async function POST(request: NextRequest) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    console.error(
      "ADMIN_PASSWORD is not configured (or too short). Admin login disabled."
    );
    return NextResponse.json(
      { error: "Admin-Login ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { password } = body;

  if (typeof password !== "string" || password !== adminPassword) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  (await cookies()).set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

export async function DELETE() {
  (await cookies()).delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
