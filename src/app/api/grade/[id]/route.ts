import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const grade = await prisma.grade.findFirst({ where: { id } });
	return NextResponse.json(grade);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
  });

  if (grade) {
    const { name, level } = await req.json();
    const payload: {
      name?: string;
      level?: number;
    } = {};

    if (name) payload.name = name;
    if (level) payload.level = Number(level);

    const updatedGrade = await prisma.grade.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatedGrade);
  } else {
    return NextResponse.json({ error: "Grade tidak dapat ditemukan" }, { status: 400 });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
  });

  if (grade) {
    const deletedGrade = prisma.grade.delete({
      where: {
        id: grade.id,
      },
    })

    const transaction = await prisma.$transaction([deletedGrade]);
    return NextResponse.json(transaction);;
  } else {
    return NextResponse.json({ error: "Grade tidak dapat ditemukan" }, { status: 400 });
  }
};