import { NextResponse, NextRequest } from "next/server";

const endpoint = `https://developer.worldcoin.org/api/v1/verify/app_${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const reqBody = {
    merkle_root: body.payload.merkle_root,
    nullifier_hash: body.payload.nullifier_hash,
    proof: body.payload.proof,
    verification_level: body.payload.verification_level,
    signal: body.signal ?? "",
    action: process.env.NEXT_PUBLIC_WC_ACTION,
  };

  try {
    const verifyRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    const wldResponse = await verifyRes.json();

    if (verifyRes.ok) {
      return NextResponse.json({ code: "success", wldResponse });
    } else {
      return NextResponse.json({ code: "failure", wldResponse });
    }
  } catch (error) {
    return NextResponse.json({ code: "error", message: (error as Error).message });
  }
}
