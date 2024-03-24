import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });
  // @ts-ignore
  if (currentAccount.role !== 'admin') return NextResponse.json({ error: "Your account is unauthorize" }, { status: 403 });

  const filterName = req.nextUrl.searchParams.get('f_name');
  const filterEmail = req.nextUrl.searchParams.get('f_email');
  const filterStatus = req.nextUrl.searchParams.get('f_status');
  const filterOffice = req.nextUrl.searchParams.get('f_office');

  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 10;

  const users = await prisma.user.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ...(filterName && { name: { contains: filterName }}),
      ...(filterEmail && { email: { contains: filterEmail }}),
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
  const { name, role = 'staff', email, password = 'pas123!', officeId } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Account already exists" }, { status: 400 });
  } else {
    const payload: {
      name: string;
      role: string;
      email: string;
      password: string;
      officeId?: string;
    } = {
      name,
      role,
      email,
      password: await hash(password, 10)
    }

    if (officeId) payload.officeId = officeId;

    const user = await prisma.user.create({
      data: payload,
    });
    return NextResponse.json(user);
  }
};

export async function PUT(req: NextRequest) {
  const { name, role, email, password } = await req.json();
  const payload: {
    name?: string;
    role?: string;
    email?: string;
    password?: string;
  } = {};

  if (name) payload.name = name;
  if (role) payload.role = role;
  if (email) payload.email = email;
  if (password) payload.password = await hash(password, 10);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: payload,
    })

    return updateUser;
  } else {
    return NextResponse.json({ error: "Account not found" }, { status: 400 });
  }
};
