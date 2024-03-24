import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { presenceId, clockOutLat, clockOutLong, clockOutDate, clockOutDistance } = await req.json();

  if (!presenceId) return NextResponse.json({ error: "Missing data in payload: presenceId" }, { status: 400 });
  if (!clockOutLat) return NextResponse.json({ error: "Missing data in payload: clockOutLat" }, { status: 400 });
  if (!clockOutLong) return NextResponse.json({ error: "Missing data in payload: clockOutLong" }, { status: 400 });
  if (!clockOutDate) return NextResponse.json({ error: "Missing data in payload: clockOutDate" }, { status: 400 });
  if (!clockOutDistance) return NextResponse.json({ error: "Missing data in payload: clockOutDistance" }, { status: 400 });

  const payload: {
    clockOutLat: string;
    clockOutLong: string;
    clockOutDistance: number;
    clockOutDate: string;
  } = {
    clockOutLat,
    clockOutLong,
    clockOutDistance,
    clockOutDate,
  };
  
  const presence = await prisma.presence.findUnique({
    where: {
      id: presenceId
    },
  });

  if (presence) {
    const user = await prisma.presence.update({
      where: {
        id: presenceId
      },
      data: payload,
    });
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ error: "You are not clock in yet" }, { status: 400 });
  }
};