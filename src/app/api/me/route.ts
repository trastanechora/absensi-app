import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(process.env.NEXTAUTH_SESSION_TOKEN_NAME || '');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  const id = currentAccount?.sub || '';

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      office: true,
      presences: {
        where: {
          createdAt: {
            gte: new Date(new Date().toLocaleDateString()),
          }
        }
      }
    },
    cache: { ttl: 5, key: `user:${id}` },
  });

  return NextResponse.json(user);
};
