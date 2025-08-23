import { prisma } from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const TodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimation: z.coerce.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: {
      userId
    }
  })
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id
    },
  });

  return NextResponse.json({ todos: todos }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: {
      userId
    }
  })
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body) return NextResponse.json({ message: "No data provided" }, { status: 400 });

  try {
    TodoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: {
        title: body.title,
        description: body.description,
        estimation: new Date(body.estimation),
        priority: body.priority,
        userId: user.id
      }
    })

    return NextResponse.json({
      message: "Successfully to create new todo",
      data: todo
    })
  } catch(error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: "Error occured when trying to make todo",
        errors: error.issues
      }, { status: 400 })
    }
    return NextResponse.json({
      message: "Unclear error occured when trying to make todo",
      errors: error
    }, { status: 500 });
  }
}