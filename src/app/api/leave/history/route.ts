import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(process.env.NEXTAUTH_SESSION_TOKEN_NAME || '');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });
  
  const leaves = await prisma.leave.findMany({
    skip: 0,
    take: 10,
    where: {
      userId: currentAccount?.sub
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      approvals: {
        include: {
          user: {
            select: {
              name: true,
              grade: true,
            }
          }
        },
        orderBy: {
          user: {
            grade: {
              level: 'asc'
            }
          }
        }
      }
    }
  });

  const approvals = await prisma.approval.findMany({
    skip: 0,
    take: 20,
    where: {
      userId: currentAccount?.sub
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      leave: {
        include: {
          approvals: true,
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  return NextResponse.json({ data: { leaves, approvals } });
};