import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { getToken } = await auth();

    const token = await getToken({ expiresInSeconds: 900 });

    return NextResponse.json({ token }, { status: 200 });
}