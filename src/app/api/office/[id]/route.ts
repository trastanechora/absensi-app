import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const office = await prisma.office.findFirst({ where: { id } });
	return NextResponse.json(office);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const office = await prisma.office.findUnique({
    where: {
      id,
    },
  });
  if (office) {
    const { name, lat, lon, radius } = await req.json();
    const payload: {
      name?: string;
      lat?: string;
      lon?: string;
      radius?: string;
    } = {};

    if (name) payload.name = name;
    if (lat) payload.lat = lat;
    if (lon) payload.lon = lon;
    if (radius) payload.radius = radius;

    const updatedOffice = await prisma.user.update({
      where: {
        id,
      },
      data: payload,
    })

    return updatedOffice;
  } else {
    return NextResponse.json({ error: "Office not found" }, { status: 400 });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const office = await prisma.office.findUnique({
    where: {
      id,
    },
  });

  if (office) {
    // const deletePresences = prisma.presence.deleteMany({
    //   where: {
    //     officeId: office.id,
    //   },
    // })

    const deleteOffice = prisma.office.delete({
      where: {
        id: office.id,
      },
    })

    // const transaction = await prisma.$transaction([deletePresences, deleteOffice]);
    const transaction = await prisma.$transaction([deleteOffice]);
    return transaction;
  } else {
    return NextResponse.json({ error: "Office not found" }, { status: 400 });
  }
};