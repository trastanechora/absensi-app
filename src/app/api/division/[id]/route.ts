import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const division = await prisma.division.findFirst({
    where: { id },
    include: { users: { include: { grade: true } } }
  });
	return NextResponse.json(division);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const division = await prisma.division.findUnique({
    where: {
      id,
    },
  });

  if (division) {
    const { name } = await req.json();
    const payload: {
      name?: string;
    } = {};

    if (name) payload.name = name;

    const updatedDivision = await prisma.division.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatedDivision);
  } else {
    return NextResponse.json({ error: "Departemen tidak dapat ditemukan" }, { status: 400 });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const division = await prisma.division.findUnique({
    where: {
      id,
    },
  });

  if (division) {
    const deleteDivision = prisma.division.delete({
      where: {
        id: division.id,
      },
    })

    // const transaction = await prisma.$transaction([deletePresences, deleteDivision]);
    const transaction = await prisma.$transaction([deleteDivision]);
    return NextResponse.json(transaction);;
  } else {
    return NextResponse.json({ error: "Departemen tidak dapat ditemukan" }, { status: 400 });
  }
};