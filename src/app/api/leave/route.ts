import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { convertDateToShortString } from '@/app/lib/date';
import { decode } from 'next-auth/jwt';

export async function GET(req: NextRequest ) {
  const filterStatus = req.nextUrl.searchParams.get('status');
  const filterUser = req.nextUrl.searchParams.get('user');
  const filterDateStart = req.nextUrl.searchParams.get('start');
  const filterDateEnd = req.nextUrl.searchParams.get('end');
  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const dateStart = new Date(filterDateStart || '');
  const dateEnd = new Date(filterDateEnd || '');
  dateEnd.setDate(dateEnd.getDate() + 1)

  const leaves = await prisma.leave.findMany({
    skip: Number(page) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
    },
    where: {
      ...(filterStatus && { status: filterStatus}),
      ...(filterUser && { userId: filterUser}),
      ...(filterDateStart && { createdAt: { gte: dateStart, lte: new Date() }}),
      ...(filterDateEnd && { createdAt: { gte: dateStart, lte: dateEnd }}),
    }
  });

  const count = await prisma.leave.count({
    where: {
      ...(filterStatus && { status: filterStatus}),
      ...(filterUser && { userId: filterUser}),
      ...(filterDateStart && { createdAt: { gte: dateStart, lte: new Date() }}),
      ...(filterDateEnd && { createdAt: { gte: dateStart, lte: dateEnd }}),
    }
  })

  return NextResponse.json({ data: leaves, total: count });
};

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get(process.env.NEXTAUTH_SESSION_TOKEN_NAME || '');
  const currentAccount = await decode({
    token: sessionToken?.value as unknown as string,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  const { approvalIds = [], acknolwledgeIds = [], dateStart, dateEnd } = await req.json();
  const userId = currentAccount?.sub || '';

  const formattedDateStart = new Date(dateStart || '');
  const formattedDateEnd = new Date(dateEnd || '');
  const timeDIfference = formattedDateEnd.getTime() - formattedDateStart.getTime();
  // const fromattedDateStartString = convertDateToShortString(formattedDateStart);
  // const fromattedDateSEndtring = convertDateToShortString(formattedDateEnd);
  const diffTime = Math.abs(timeDIfference);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const leave = await prisma.leave.create({
    data: {
      userId,
      status: 'pending',
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      dayCount: diffDays
    }
  });

  const approvalData = approvalIds.map((id: string) => {
    return { type: 'approval', status: 'pending', leaveId: leave.id, userId: id }
  });
  const acknoledgeData = acknolwledgeIds.map((id: string) => {
    return { type: 'acknoledge', status: 'pending', leaveId: leave.id, userId: id }
  });

  const approvals = await prisma.approval.createMany({
    data: [ ...approvalData, ...acknoledgeData ]
  })

  return NextResponse.json({ ...leave, approvals });
};
