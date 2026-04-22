import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function POST(req: NextRequest) {
  const { encrypted } = await req.json();

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.alloc(16, 0),
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return NextResponse.json(JSON.parse(decrypted));
}
