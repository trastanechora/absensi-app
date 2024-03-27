import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const appRegex = new RegExp('/app*');
const dashboardRegex = new RegExp('/dashboard*');
const loginRegex = new RegExp('/login*');
const registerRegex = new RegExp('/register*');
const registerApiRegex = new RegExp('/api/user/register*')
const nextRegex = new RegExp('/_next*');
const authRegex = new RegExp('/auth*');

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (nextRegex.test(path) || authRegex.test(path) || registerApiRegex.test(path)) {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && appRegex.test(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (dashboardRegex.test(path)) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
    if (session && session.role !== 'admin') return NextResponse.redirect(new URL("/login", req.url));
  }

  if (loginRegex.test(path) || registerRegex.test(path)) {
    if (session && session.role !== 'admin') {
      NextResponse.redirect(new URL("/app", req.url));
    } else {
      NextResponse.redirect(new URL("/dashboard/employee", req.url));
    }
  }

  return NextResponse.next();
}