import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For localStorage-based auth, we don't need server-side middleware
  // Just let all admin routes pass through
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
