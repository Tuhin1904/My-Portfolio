import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY!; 

export async function POST(req: NextRequest) {
  const body = await req.json();

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.alloc(16, 0),
  );

  let encrypted = cipher.update(JSON.stringify(body), "utf8", "hex");
  encrypted += cipher.final("hex");

  return NextResponse.json({ encrypted });
}
