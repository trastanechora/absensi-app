import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 100;

  const offices = await prisma.office.findMany({
    orderBy: {
      name: 'asc'
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return NextResponse.json(offices.map(office => ({ id: office.id, name: office.name })));
}
