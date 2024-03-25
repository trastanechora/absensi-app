import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const presence = await prisma.presence.findFirst({ where: { id } });
	return NextResponse.json(presence);
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { userId, clockOutLat, clockOutLong, clockOutDate } = await req.json();

  if (!userId) return NextResponse.json({ error: "Ada data yang kurang: userId" }, { status: 400 });
  if (!clockOutLat) return NextResponse.json({ error: "Ada data yang kurang: clockOutLat" }, { status: 400 });
  if (!clockOutLong) return NextResponse.json({ error: "Ada data yang kurang: clockOutLong" }, { status: 400 });
	if (!clockOutDate) return NextResponse.json({ error: "Ada data yang kurang: clockOutDate" }, { status: 400 });
	
	const presence = await prisma.presence.findFirst({
    where: {
      id,
    },
	});
	
	if (presence) {
		const payload: {
			userId: string;
			clockOutLat: string;
			clockOutLong: string;
			clockOutDate: string;
		} = {
			userId,
			clockOutLat,
			clockOutLong,
			clockOutDate,
		};
		
   const updatePresence = await prisma.presence.update({
      where: {
        id,
      },
      data: payload,
    })

    return NextResponse.json(updatePresence);
  } else {
    return NextResponse.json({ error: "Your presence not recorded yet, please clock in first" }, { status: 400 });
  }
};