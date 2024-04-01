import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const filePath = path.resolve(".", `public/uploads/${id}`);
  const imageBuffer = fs.readFileSync(filePath);

  const headers = new Headers();
  headers.set("Content-Type", "image/*");

  return new NextResponse(imageBuffer, { status: 200, statusText: "OK", headers });
}
