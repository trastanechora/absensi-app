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
    const { name, lat, long, radius, duration } = await req.json();
    const payload: {
      name?: string;
      lat?: string;
      long?: string;
      radius?: number;
      duration?: number;
    } = {};

    if (name) payload.name = name;
    if (lat) payload.lat = String(lat);
    if (long) payload.long = String(long);
    if (radius) payload.radius = radius;
    if (duration || duration === 0) payload.duration = duration;

    const updatedOffice = await prisma.office.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatedOffice);
  } else {
    return NextResponse.json({ error: "Lokasi tidak dapat ditemukan" }, { status: 400 });
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
    return NextResponse.json(transaction);;
  } else {
    return NextResponse.json({ error: "Lokasi tidak dapat ditemukan" }, { status: 400 });
  }
};