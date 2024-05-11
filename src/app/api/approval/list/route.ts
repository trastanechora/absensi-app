import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(process.env.NEXTAUTH_SESSION_TOKEN_NAME || '');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  const currentGradeLevel = currentAccount?.gradeLevel as number;
  const currentDivisionIds = currentAccount?.divisionIds as string[];

  const grades = await prisma.grade.findMany({
    include: {
      users: {
        where: {
          divisions: {
            some: {
              id: {
                in: currentDivisionIds
              }
            }
          }
        },
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: {
      level: 'asc',
    }
  });

  const filteredGrades = grades.filter(grade => grade.level >= currentGradeLevel);

  console.log('[DEBUG] currentAccount', currentAccount);
  console.log('[DEBUG] filteredGrades', filteredGrades);
  return NextResponse.json({ status: 200, data: filteredGrades });
}
