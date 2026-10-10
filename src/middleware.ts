import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./i18n/config";

function preferredLocale(request: NextRequest) {
	const header = request.headers.get("accept-language") ?? "";
	const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase() ?? "";
	return isLocale(first) ? first : defaultLocale;
}

export function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	// "/" → "/hr", "/pricing" → "/hr/pricing" (locale-less links people type or share)
	url.pathname = `/${preferredLocale(request)}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/", "/flow", "/pricing", "/why"],
};
