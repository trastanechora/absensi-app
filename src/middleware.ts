import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && path.includes('/dashboard') && path.includes('/app')) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && (path.includes('/login') || path.includes('/register'))) {
    // Redirect based on user role
    if (session.role === 'admin') return NextResponse.redirect(new URL("/dashboard/employee", req.url));
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}