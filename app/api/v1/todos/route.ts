import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) return new Response("Unathorized", { status: 401 });

    const user = await prisma.user.findUnique({
        where: {
            userId
        }
    })

    if (!user) return new Response("Unathorized", { status: 401 });

    const todos = await prisma.todo.findMany({
        where: {
            userId: user.id
        }
    })

    return new Response(JSON.stringify({ data: todos }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    })
}