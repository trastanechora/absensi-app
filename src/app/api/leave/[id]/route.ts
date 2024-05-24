import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log('[DEBUG] id', id);
  
  const leave = await prisma.leave.findFirst(
    { where: { id },
      include: {
        user: true,
        approvals: {
          include: {
            user: {
              include: {
                grade: true,
              },
            },
          },
          orderBy: {
            user: {
              grade: {
                level: 'asc',
              }
            }
          }
        }
      },
  });
	return NextResponse.json(leave);
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log('[DEBUG] deleting', id);
  
  const leave = await prisma.leave.findUnique({
    where: {
      id,
    },
  });

  console.log('[DEBUG] leave', leave);
  if (leave) {
    const deletedLeave = await prisma.leave.delete({
      where: {
        id,
      },
    })

    return NextResponse.json(deletedLeave);
  } else {
    return NextResponse.json({ error: "Data cuti tidak dapat ditemukan" }, { status: 400 });
  }
};