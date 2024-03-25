import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest ) {
  const filterOffice = req.nextUrl.searchParams.get('f_office_id');
  const filterUser = req.nextUrl.searchParams.get('f_user_id');
  const filterDateStart = req.nextUrl.searchParams.get('f_date_start');
  const filterDateEnd = req.nextUrl.searchParams.get('f_date_end');
  const page = req.nextUrl.searchParams.get('page') || 1;
  const limit = req.nextUrl.searchParams.get('limit') || 10;

  const presences = await prisma.presence.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      office: true,
      user: true,
    },
    where: {
      ...(filterOffice && { officeId: filterOffice}),
      ...(filterUser && { userId: filterUser}),
      ...(filterDateStart && { createdAt: { gte: new Date(filterDateStart), lte: new Date() }}),
      ...(filterDateEnd && { createdAt: { gte: new Date(filterDateStart || ''), lte: new Date(filterDateEnd) }}),
    }
  });

  return NextResponse.json(presences);
};

// export async function POST(req: NextRequest) {
//   const { userId, officeId, clockInLat, clockInLong, clockInDate, clockInDistance } = await req.json();

//   if (!userId) return NextResponse.json({ error: "Ada data yang kurang: userId" }, { status: 400 });
//   if (!officeId) return NextResponse.json({ error: "Ada data yang kurang: officeId" }, { status: 400 });
//   if (!clockInLat) return NextResponse.json({ error: "Ada data yang kurang: clockInLat" }, { status: 400 });
//   if (!clockInLong) return NextResponse.json({ error: "Ada data yang kurang: clockInLong" }, { status: 400 });
//   if (!clockInDate) return NextResponse.json({ error: "Ada data yang kurang: clockInDate" }, { status: 400 });
//   if (!clockInDistance) return NextResponse.json({ error: "Ada data yang kurang: clockInDistance" }, { status: 400 });

//   const payload: {
//     userId: string;
//     officeId: string;
//     clockInLat: string;
//     clockInLong: string;
//     clockInDistance: number;
//     clockInDate: string;
//   } = {
//     userId,
//     officeId,
//     clockInLat,
//     clockInLong,
//     clockInDistance,
//     clockInDate,
//   };
  
//   const presences = await prisma.presence.findMany({
//     where: {
//       userId,
//       createdAt: {
//         gte: new Date(new Date().toLocaleDateString()),
//       }
//     },
//   });

//   if (presences.length > 0) {
//     return NextResponse.json({ error: "You are already clocked in" }, { status: 400 });
//   } else {
//     const user = await prisma.presence.create({
//       data: payload,
//     });
//     return NextResponse.json(user);
//   }
// };