import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash, compare } from "bcrypt";
import { decode } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
    const sessionToken = req.cookies.get('next-auth.session-token');
    const currentAccount = await decode({
      token: sessionToken?.value as unknown as string,
      secret: process.env.NEXTAUTH_SECRET || '',
    });

  const user = await prisma.user.findUnique({
    where: {
      id: currentAccount?.sub,
    },
  });
  if (user) {
    const { password, newPassword } = await req.json();
    const isPasswordValid = await compare(password, user.password);
    if (isPasswordValid) {
      const payload: {
        password: string;
      } = {
        password: await hash(newPassword, 10),
      };

      const updatedUser = await prisma.user.update({
        where: {
          id: currentAccount?.sub,
        },
        data: payload,
      })
      return NextResponse.json(updatedUser);
    } else {
      return NextResponse.json({ error: "Password lama tidak cocok" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Terjadi kesalahan. Akun tidak dapat ditemukan, mohon hubungi admin" }, { status: 400 });
  }
};