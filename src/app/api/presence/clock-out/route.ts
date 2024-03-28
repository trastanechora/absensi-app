import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { convertDateToShortString } from '@/app/lib/date';

import { timeDistance } from '@/app/lib/time';

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
    
    const fileName = `${fromattedDateString}_${userId}_out.png`
    const filePath = `./public/uploads/${fileName}`;
    // @ts-ignore
    await pump(file.stream(), fs.createWriteStream(filePath));

    const imageUrl = HOST + `/uploads/${fileName}`;

    const presenceId = formData.get('presenceId');
    const clockOutLat = formData.get('clockOutLat');
    const clockOutLong = formData.get('clockOutLong');
    const clockOutDistance = formData.get('clockOutDistance');
    const clockOutPhoto = imageUrl;

    if (!userId || userId === null || typeof userId !== 'string') return NextResponse.json({ error: "Ada data yang kurang: userId" }, { status: 400 });
    if (!presenceId || presenceId === null || typeof presenceId !== 'string') return NextResponse.json({ error: "Ada data yang kurang: presenceId" }, { status: 400 });
    if (!clockOutLat || clockOutLat === null || typeof clockOutLat !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockOutLat" }, { status: 400 });
    if (!clockOutLong || clockOutLong === null || typeof clockOutLong !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockOutLong" }, { status: 400 });
    if (!clockOutDistance || clockOutDistance === null || typeof clockOutDistance !== 'string') return NextResponse.json({ error: "Ada data yang kurang: clockOutDistance" }, { status: 400 });

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
        clockOutPhoto: string;
      } = {
        clockOutLat,
        clockOutLong,
        clockOutDistance: Number(clockOutDistance),
        clockOutDate: new Date().toISOString(),
        duration,
        clockOutPhoto,
      };
      
      const user = await prisma.presence.update({
        where: {
          id: presenceId
        },
        data: payload,
      });
      return NextResponse.json({ status: "success", data: user });
    } else {
      return NextResponse.json({ status: "fail", error: "You are not clock in yet" }, { status: 400 });
    }
  }
  catch (e) {
    return  NextResponse.json({ status: "fail", data: e })
  }
};