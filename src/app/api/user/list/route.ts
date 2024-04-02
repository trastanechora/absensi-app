import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');
  const name = req.nextUrl.searchParams.get('name');
  const email = req.nextUrl.searchParams.get('email');

  console.log('[DEBUG] page', page);
  console.log('[DEBUG] limit', limit);
  console.log('[DEBUG] name', name);
  console.log('[DEBUG] email', email);

  const users = await prisma.user.findMany({
    orderBy: {
      name: 'asc'
    },
    where: {
      role: {
        not: 'admin'
      },
      name: {
        contains: name || '',
        mode: 'insensitive',
      },
      email: {
        contains: email || '',
        mode: 'insensitive',
      }
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  console.log('[DEBUG] users', users);


  return NextResponse.json(users.map(user => ({ id: user.id, name: user.name })));
}
