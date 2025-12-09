import { NextRequest, NextResponse } from "next/server";

const HOME = "/home";

const OPEN = [
  "/",
  "/contato",
  "/forgot-password",
  "/reset-password",
  "/produtos",
  "/artigos",
  "/veterinarios",
  "/locais",
  "/profile",
  "/verify",
  "/home",
];
const ONLY_GUEST = ["/login", "/register"];

// prefixes e extensões de assets/imagens que devem ser liberados
const ASSET_PREFIXES = ["/_next/", "/assets/", "/images/", "/public/"];
const ASSET_EXT = /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)$/i;

const hit = (path: string, list: string[]) =>
  list.some((p) => path === p || path.startsWith(p + "/"));

// Validação básica do formato JWT (não valida assinatura, apenas estrutura)
function isValidJwtFormat(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Tenta decodificar o payload para verificar se não expirou
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expirado
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
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

  const token = req.cookies.get("token")?.value;
  const hasValidToken = token && isValidJwtFormat(token);

  // páginas só para convidados (se logado -> redireciona)
  if (hit(pathname, ONLY_GUEST)) {
    return hasValidToken ? redirect(req, HOME) : NextResponse.next();
  }

  // demais rotas: protegidas
  if (!hasValidToken) return toLogin(req);

  return NextResponse.next();
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
