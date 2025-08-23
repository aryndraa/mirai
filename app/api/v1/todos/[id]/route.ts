import { prisma } from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UpdateTodoSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    estimation: z.coerce.date().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    userId: z.uuid({ version: "v4" }).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    const { userId } = getAuth(request);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: {
            userId
        }
    });
    if (!user)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = (await params).id;
    const todo = await prisma.todo.findUnique({
        where: {
            id: Number(id),
            userId: user.id
        }
    })
    if (!todo)
        return NextResponse.json(
            { message: `There's no todo with id = ${id}` },
            { status: 404 }
        );

    return NextResponse.json(
        {
            message: "Success to retrieve todo",
            data: todo,
        },
        { status: 200 }
    );
}

export async function UPDATE(
    request: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    const id = (await params).id;
}
