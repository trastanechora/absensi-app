import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const approval = await prisma.approval.findFirst({ where: { id } });
	return NextResponse.json(approval);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const approval = await prisma.approval.findUnique({
    where: {
      id,
    },
  });

  if (approval) {
    const { status } = await req.json();
    const payload: {
      status?: string;
    } = {};

    if (status) payload.status = status;

    const updatedApproval = await prisma.approval.update({
      where: {
        id,
      },
      data: payload,
    });

    const pendingApprovals = await prisma.approval.findMany({
      where: {
        type: 'approval',
        status: 'pending',
        leaveId: updatedApproval.leaveId,
      }
    });

    console.log(JSON.stringify(pendingApprovals))

    if (pendingApprovals.length === 0) {
      await prisma.leave.update({
        where: {
          id: updatedApproval.leaveId,
        },
        data: {
          status: 'approved'
        },
      });
    }

    return NextResponse.json(updatedApproval);
  } else {
    return NextResponse.json({ error: "Ijin cuti tidak dapat ditemukan" }, { status: 400 });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const approval = await prisma.approval.findUnique({
    where: {
      id,
    },
  });

  if (approval) {
    const deletedApproval = prisma.approval.delete({
      where: {
        id: approval.id,
      },
    })

    const transaction = await prisma.$transaction([deletedApproval]);
    return NextResponse.json(transaction);;
  } else {
    return NextResponse.json({ error: "Ijin cuti tidak dapat ditemukan" }, { status: 400 });
  }
};