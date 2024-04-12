import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {

  const user = await clerkClient.users.getUser(params.userId);

  return NextResponse.json({ user, status: 201 });
}