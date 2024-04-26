import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filterName = req.nextUrl.searchParams.get('name');

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const divisions = await prisma.division.findMany({
    skip: Number(page) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  });

  const count = await prisma.division.count({
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  })

  return NextResponse.json({ data: divisions, total: count});
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
  }
  const exists = await prisma.division.findUnique({
    where: {
      name,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Departemen dengan nama ini sudah ada" }, { status: 400 });
  } else {
    const user = await prisma.division.create({
      data: {
        name,
      },
    });
    return NextResponse.json(user);
  }
};
