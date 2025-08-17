import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const user = await currentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const profile = await prisma.user.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    return Response.json(profile);
}