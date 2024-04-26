import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filterName = req.nextUrl.searchParams.get('name');

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const offices = await prisma.office.findMany({
    skip: Number(page) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  });

  const count = await prisma.office.count({
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  })

  return NextResponse.json({ data: offices, total: count });
}

export async function POST(req: Request) {
  const { name, radius = 200, duration = 5 * 60 * 60 * 1000, lat, long } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
  }
  const exists = await prisma.office.findUnique({
    where: {
      name,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Lokasi dengan nama ini sudah ada" }, { status: 400 });
  } else {
    const user = await prisma.office.create({
      data: {
        name,
        radius,
        duration,
        lat: String(lat),
        long: (String(long))
      },
    });
    return NextResponse.json(user);
  }
};
