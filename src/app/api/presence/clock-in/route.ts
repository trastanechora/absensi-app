import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, officeId, clockInLat, clockInLong, clockInDate, clockInDistance } = await req.json();

  if (!userId) return NextResponse.json({ error: "Missing data in payload: userId" }, { status: 400 });
  if (!officeId) return NextResponse.json({ error: "Missing data in payload: officeId" }, { status: 400 });
  if (!clockInLat) return NextResponse.json({ error: "Missing data in payload: clockInLat" }, { status: 400 });
  if (!clockInLong) return NextResponse.json({ error: "Missing data in payload: clockInLong" }, { status: 400 });
  if (!clockInDate) return NextResponse.json({ error: "Missing data in payload: clockInDate" }, { status: 400 });
  if (!clockInDistance) return NextResponse.json({ error: "Missing data in payload: clockInDistance" }, { status: 400 });

  const payload: {
    userId: string;
    officeId: string;
    clockInLat: string;
    clockInLong: string;
    clockInDistance: number;
    clockInDate: string;
  } = {
    userId,
    officeId,
    clockInLat,
    clockInLong,
    clockInDistance,
    clockInDate,
  };
  
  const presences = await prisma.presence.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().toLocaleDateString()),
      }
    },
  });

  if (presences.length > 0) {
    return NextResponse.json({ error: "You are already clocked in" }, { status: 400 });
  } else {
    const user = await prisma.presence.create({
      data: payload,
    });
    return NextResponse.json(user);
  }
};