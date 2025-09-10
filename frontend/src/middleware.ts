import { NextRequest, NextResponse } from "next/server";
import apiClient from "./lib/http/api";

const APP_HOME = "/app";

const OPEN = ["/", "/sobre", "/contato", "/forgot-password", "/reset-password"];

const ONLY_GUEST = ["/login", "/register"];

const hit = (path: string, list: string[]) =>
  list.some((p) => path === p || path.startsWith(p + "/"));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (hit(pathname, OPEN)) return NextResponse.next();

  if (hit(pathname, ONLY_GUEST)) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.next();

    const ok = await validateSession(token);
    if (ok) return redirect(req, APP_HOME);

    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) return toLogin(req);

  const ok = await validateSession(token);
  return ok ? NextResponse.next() : toLogin(req);
}

async function validateSession(token: string): Promise<boolean> {
  try {
    await apiClient.get("/auth/session", {
      headers: { cookie: `token=${token}` },
    });
    return true;
  } catch {
    return false;
  }
}

function toLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set(
    "next",
    req.nextUrl.pathname + (req.nextUrl.search || "")
  );
  return NextResponse.redirect(url);
}

function redirect(req: NextRequest, to: string) {
  const url = req.nextUrl.clone();
  url.pathname = to;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
