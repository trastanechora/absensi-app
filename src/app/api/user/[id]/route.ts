import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const user = await prisma.user.findFirst({ where: { id }, include: { office: true } });
	return NextResponse.json(user);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const { name, role, email, password, officeId, isStrictRadius, isStrictDuration } = await req.json();
    const payload: {
      name?: string;
      role?: string;
      email?: string;
      password?: string;
      officeId?: string;
      isStrictRadius?: boolean;
      isStrictDuration?: boolean;
    } = {
      isStrictRadius,
      isStrictDuration
    };

    if (name) payload.name = name;
    if (role) payload.role = role;
    if (email) payload.email = email;
    if (officeId) payload.officeId = officeId;
    if (password) payload.password = await hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatedUser);
  } else {
    return NextResponse.json({ error: "Akun tidak dapat ditemukan" }, { status: 400 });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user) {
    const deletePresences = prisma.presence.deleteMany({
      where: {
        userId: user.id,
      },
    })

    const deleteUser = prisma.user.delete({
      where: {
        id: user.id,
      },
    })

    const transaction = await prisma.$transaction([deletePresences, deleteUser]);
    return NextResponse.json(transaction);
  } else {
    return NextResponse.json({ error: "Akun tidak dapat ditemukan" }, { status: 400 });
  }
};