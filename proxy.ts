import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "pt"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  if (hasLocale) return;

  const preferred = request.headers
    .get("accept-language")
    ?.split(",")[0]
    .split("-")[0];
  const locale =
    locales.includes(preferred ?? "") ? preferred! : defaultLocale;
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|fonts|assets|.*\\..*).*)" ],
};
