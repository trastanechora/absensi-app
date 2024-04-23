import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(process.env.NEXTAUTH_SESSION_TOKEN_NAME || '');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });
  // @ts-ignore
  if (currentAccount.role !== 'admin') return NextResponse.json({ error: "Your account is unauthorize" }, { status: 403 });

  const filterName = req.nextUrl.searchParams.get('name');
  const filterEmail = req.nextUrl.searchParams.get('email');
  const filterStatus = req.nextUrl.searchParams.get('status');
  const filterOffice = req.nextUrl.searchParams.get('office');

  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 10;

  const users = await prisma.user.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      role: {
        not: 'admin'
      },
      ...(filterName && { name: { contains: filterName, mode: 'insensitive' }}),
      ...(filterEmail && { email: { contains: filterEmail, mode: 'insensitive' }}),
      ...(filterStatus && { status: filterStatus}),
      ...(filterOffice && { officeId: filterOffice}),
    },
    include: {
      office: true
    }
  });

  return NextResponse.json(users);
};

export async function POST(req: NextRequest) {
  const { name, role = 'staff', email, password = 'pas123!', officeId, isStrictRadius = true, isStrictDuration = true, gradeId, divisionIds } = await req.json();
  if (!name) return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
  if (!email) return NextResponse.json({ error: "Email tidak boleh kosong" }, { status: 400 });

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
      officeId?: string;
      isStrictRadius?: boolean;
      isStrictDuration?: boolean;
      gradeId?: string;
      divisions?: {
        connect: {
          id: string;
        }[];
      };
    } = {
      name,
      role,
      email,
      password: await hash(password, 10),
      isStrictRadius,
      isStrictDuration
    }

    if (officeId) payload.officeId = officeId;
    if (gradeId) payload.gradeId = gradeId;
    if (divisionIds) payload.divisions = {
      connect: divisionIds.map((divisionId: string) => ({ id: divisionId }))
    };

    const user = await prisma.user.create({
      data: payload,
    });
    return NextResponse.json(user);
  }
};
