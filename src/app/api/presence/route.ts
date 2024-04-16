import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest ) {
  const filterOffice = req.nextUrl.searchParams.get('office');
  const filterUser = req.nextUrl.searchParams.get('user');
  const filterDateStart = req.nextUrl.searchParams.get('start');
  const filterDateEnd = req.nextUrl.searchParams.get('end');
  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 10;

  const dateStart = new Date(filterDateStart || '');
  const dateEnd = new Date(filterDateEnd || '');
  dateEnd.setDate(dateEnd.getDate() + 1)

  const presences = await prisma.presence.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      office: true,
      user: true,
    },
    where: {
      ...(filterOffice && { officeId: filterOffice}),
      ...(filterUser && { userId: filterUser}),
      ...(filterDateStart && { createdAt: { gte: dateStart, lte: new Date() }}),
      ...(filterDateEnd && { createdAt: { gte: dateStart, lte: dateEnd }}),
    }
  });

  return NextResponse.json(presences);
};
