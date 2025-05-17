import { NextResponse } from "next/server"
import { signOutAdmin } from "@/lib/supabase"

export async function POST() {
  await signOutAdmin()
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL))
}
