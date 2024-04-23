import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 100;

  const divisions = await prisma.division.findMany({
    orderBy: {
      name: 'asc'
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return NextResponse.json(divisions.map(division => ({ id: division.id, name: division.name })));
}
