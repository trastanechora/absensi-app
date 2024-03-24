import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filterName = req.nextUrl.searchParams.get('f_name');

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const offices = await prisma.office.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ...(filterName && { name: { contains: filterName }}),
    }
  });

  return NextResponse.json(offices);
}

export async function POST(req: Request) {
  const { name, radius, lat, long } = await req.json();
  const exists = await prisma.office.findUnique({
    where: {
      name,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Office already exists" }, { status: 400 });
  } else {
    const user = await prisma.office.create({
      data: {
        name,
        radius,
        lat,
        long
      },
    });
    return NextResponse.json(user);
  }
};
