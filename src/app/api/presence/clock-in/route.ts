import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { convertDateToShortString } from '@/app/lib/date';

const pump = promisify(pipeline);

const HOST = process.env.NEXTAUTH_URL;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const fromattedDateString = convertDateToShortString(new Date());
  const userId = formData.get('userId');

  try {
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Foto tidak tersedia" }, { status: 400 });
    }
    
    const fileName = `${fromattedDateString}_${userId}_in.png`
    const filePath = `./public/uploads/${fileName}`;
    // @ts-ignore
    await pump(file.stream(), fs.createWriteStream(filePath));

    const imageUrl = HOST + `/uploads/${fileName}`;

    const officeId = formData.get('officeId');
    const clockInLat = formData.get('clockInLat');
    const clockInLong = formData.get('clockInLong');
    const clockInDistance = formData.get('clockInDistance');
    const clockInPhoto = imageUrl;

    if (!userId || userId === null || typeof userId !== 'string') return NextResponse.json({ error: "Ada data yang kurang: userId" }, { status: 400 });
    if (!officeId || officeId === null || typeof officeId !== 'string') return NextResponse.json({ error: "Ada data yang kurang: officeId" }, { status: 400 });
    if (!clockInLat || clockInLat === null || typeof clockInLat !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockInLat" }, { status: 400 });
    if (!clockInLong || clockInLong === null || typeof clockInLong !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockInLong" }, { status: 400 });
    if (!clockInDistance || clockInDistance === null || typeof clockInDistance !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockInDistance" }, { status: 400 });

    const payload: {
      userId: string;
      officeId: string;
      clockInLat: string;
      clockInLong: string;
      clockInDistance: number;
      clockInDate: string;
      clockInPhoto: string;
    } = {
      userId,
      officeId,
      clockInLat,
      clockInLong,
      clockInDistance: Number(clockInDistance),
      clockInDate: new Date().toISOString(),
      clockInPhoto,
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
      return NextResponse.json({ status: "fail", error: "You are already clocked in" }, { status: 400 });
    } else {
      const user = await prisma.presence.create({
        data: payload,
      });
      return NextResponse.json({ status: "success", data: user });
    }

  }
  catch (e) {
    return  NextResponse.json({ status: "fail", data: e })
  }
};