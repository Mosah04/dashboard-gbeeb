import { NextResponse } from "next/server";
import auth from "./auth";

export async function middleware(req) {
  const user = await auth.getUser();
  if (!user) {
    req.cookies.delete("session");
    const response = NextResponse.redirect(new URL("/login", req.url));
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/badges", "/participants", "/dortoirs"],
};
