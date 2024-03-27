import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {

    const payload: {
      password?: string;
    } = {
      password: await hash('pas123!', 10)
    };

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatedUser);
  } else {
    return NextResponse.json({ error: "Terjadi kesalahan, akun tidak dapat ditemukan" }, { status: 400 });
  }
};