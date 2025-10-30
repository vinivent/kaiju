import { NextRequest, NextResponse } from "next/server";
import apiClient from "./lib/http/api";

const HOME = "/home";

const OPEN = ["/", "/contato", "/forgot-password", "/reset-password", "/produtos", "/artigos"];
const ONLY_GUEST = ["/login", "/register"];

// prefixes e extensões de assets/imagens que devem ser liberados
const ASSET_PREFIXES = ["/_next/", "/assets/", "/images/", "/public/"];
const ASSET_EXT = /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)$/i;

const hit = (path: string, list: string[]) =>
  list.some((p) => path === p || path.startsWith(p + "/"));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // libera assets e imagens
  if (
    pathname === "/favicon.ico" ||
    ASSET_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ASSET_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // páginas abertas: sempre acessíveis
  if (hit(pathname, OPEN)) return NextResponse.next();

  // páginas só para convidados (se logado -> redireciona)
  if (hit(pathname, ONLY_GUEST)) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.next();

    const ok = await validateSession(token);
    return ok ? redirect(req, HOME) : NextResponse.next();
  }

  // demais rotas: protegidas
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
