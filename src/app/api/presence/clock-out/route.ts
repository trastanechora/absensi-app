import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { timeDistance } from '@/app/lib/time';

export async function POST(req: NextRequest) {
  const { presenceId, clockOutLat, clockOutLong, clockOutDate, clockOutDistance } = await req.json();

  if (!presenceId) return NextResponse.json({ error: "Ada data yang kurang: presenceId" }, { status: 400 });
  if (!clockOutLat) return NextResponse.json({ error: "Ada data yang kurang: clockOutLat" }, { status: 400 });
  if (!clockOutLong) return NextResponse.json({ error: "Ada data yang kurang: clockOutLong" }, { status: 400 });
  if (!clockOutDate) return NextResponse.json({ error: "Ada data yang kurang: clockOutDate" }, { status: 400 });
  if (!clockOutDistance) return NextResponse.json({ error: "Ada data yang kurang: clockOutDistance" }, { status: 400 });

  const presence = await prisma.presence.findUnique({
    where: {
      id: presenceId
    },
  });

  if (presence && presence !== null) {
    const clockInTime = presence.clockInDate?.getTime();
    const nowTime = new Date().getTime();
    const duration = timeDistance(clockInTime || nowTime, nowTime);

    const payload: {
      clockOutLat: string;
      clockOutLong: string;
      clockOutDistance: number;
      clockOutDate: string;
      duration: string;
    } = {
      clockOutLat,
      clockOutLong,
      clockOutDistance,
      clockOutDate,
      duration
    };
    
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