import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { username, email, password } = body;

    try {
        const evt = await (await clerkClient()).users.createUser({
            username,
            emailAddress: [email],
            password
        });

        const user = await prisma.user.create({
            data: {
                userId: evt.id,
            }
        });

        const res = NextResponse.json({ success: true });
        return res;
    } catch(err) {
        return NextResponse.json({ success: false, message: "Register Failed", errors: err }, { status: 400 });
    }
}