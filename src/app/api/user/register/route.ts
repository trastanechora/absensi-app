import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  const { name = 'Admin', role = 'admin', email, password } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Akun dengan email tersebut sudah ada" }, { status: 400 });
  } else {
    const payload: {
      name: string;
      role: string;
      email: string;
      password: string;
    } = {
      name: name + ' ' + email,
      role,
      email,
      password: await hash(password, 10)
    }

    const user = await prisma.user.create({
      data: payload,
    });
    return NextResponse.json(user);
  }
};