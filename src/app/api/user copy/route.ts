import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  
  if (id) {
    const user = await prisma.user.findFirst({ where: { id } });
    return user;
  }

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const users = await prisma.user.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return NextResponse.json(users);
}