import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filterName = req.nextUrl.searchParams.get('f_name');

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const grades = await prisma.grade.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      level: 'desc'
    },
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  });

  const count = await prisma.grade.count({
    where: {
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
    }
  })

  return NextResponse.json({ data: grades, total: count });
}

export async function POST(req: Request) {
  const { name, level } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
  }

  if (!level) {
    return NextResponse.json({ error: "Level tidak boleh kosong" }, { status: 400 });
  }

  const user = await prisma.grade.create({
      data: {
        name,
        level,
      },
    });
    return NextResponse.json(user);
};
