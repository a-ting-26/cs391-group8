// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Prepare a response object that Supabase can attach cookies to
  const res = NextResponse.next();

  // Bind Supabase to this req/res so session cookies are read/updated
  const supabase = createMiddlewareClient({ req, res });

  // Will refresh the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle only the root path to choose a landing destination
  if (req.nextUrl.pathname === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/landing", req.url));
    }

    // Role-based fan-out (stored in user_metadata.role)
    const role = user.user_metadata?.role;
    if (role === "vendor") return NextResponse.redirect(new URL("/vendor", req.url));
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));

    // default: student
    return NextResponse.redirect(new URL("/student", req.url));
  }

  // Important: return `res` so cookie updates persist
  return res;
}

// Only run on `/` to avoid unnecessary work & redirect loops
export const config = {
  matcher: ["/"],
};
