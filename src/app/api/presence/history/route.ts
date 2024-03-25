import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });
  
  const user = await prisma.user.findUnique({
    where: {
      id: currentAccount?.sub
    },
    include: {
      presences: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          office: true
        }
      }
    }
  });

  const presences = user?.presences;

  return NextResponse.json(presences);
};