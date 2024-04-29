import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        loggedIn: false
      },
    })

    return NextResponse.json(updatedUser);
  } else {
    return NextResponse.json({ error: "Terjadi kesalahan, akun tidak dapat ditemukan" }, { status: 400 });
  }
};