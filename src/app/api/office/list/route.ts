import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const offices = await prisma.office.findMany({
    orderBy: {
      name: 'asc'
    },
  });

  return NextResponse.json(offices.map(office => ({ id: office.id, name: office.name })));
}