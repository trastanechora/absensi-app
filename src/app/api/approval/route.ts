import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filterStatus = req.nextUrl.searchParams.get('status');
  const filterUser = req.nextUrl.searchParams.get('user');
  const filterLeave = req.nextUrl.searchParams.get('leave');

  const page = req.nextUrl.searchParams.get('page');
  const limit = req.nextUrl.searchParams.get('limit');

  const approvals = await prisma.approval.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ...(filterStatus && { status: filterStatus }),
      ...(filterUser && { user: { id: filterUser }}),
      ...(filterLeave && { leave: { id: filterLeave }}),
    }
  });

  return NextResponse.json(approvals);
}

export async function POST(req: Request) {
  const { type, leave, user, status = 'pending' } = await req.json();
  if (!type) {
    return NextResponse.json({ error: "Tipe tidak boleh kosong" }, { status: 400 });
  }

  if (!leave) {
    return NextResponse.json({ error: "ID Cuti tidak boleh kosong" }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ error: "ID Karyawan tidak boleh kosong" }, { status: 400 });
  }

  const approval = await prisma.approval.create({
      data: {
        type,
        leaveId: leave,
        userId: user,
        status,
      },
    });
    return NextResponse.json(approval);
};
