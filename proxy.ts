import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/admin/session";

/**
 * Soft-launch gate. While the full site is unfinished, only the routes below
 * are publicly reachable — every other path is rewritten to /maintenance and
 * served with a 503 (so crawlers treat it as temporary, not a dead page).
 *
 * To launch more pages, add their path prefix here. To lift the gate entirely,
 * delete this file.
 *
 * (Uses the `proxy` file convention — the renamed successor to `middleware`.)
 */
const ALLOWED_PREFIXES = [
  "/get-started",
  "/request",
  "/faq",
  "/consultation",
  "/process",
  "/xiaomi-order",
  "/admin-login",
  // Legal — typically footer-linked / required even at soft launch.
  "/privacy",
  "/terms",
  "/compliance",
  // Internal tooling — kept reachable so the team retains dashboard access.
  "/admin",
  // The maintenance screen itself.
  "/maintenance",
];

function isAllowed(pathname: string): boolean {
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    !isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
  ) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (isAllowed(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url, { status: 503 });
}

export const config = {
  // Run on everything except Next internals and static asset files. Those must
  // stay reachable so the allowed pages (and the maintenance screen) render.
  matcher: [
    "/((?!_next/|favicon.ico|icon.png|robots.txt|sitemap.xml|logo/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|map)$).*)",
  ],
};
