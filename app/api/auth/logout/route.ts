import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const reqToken = headers().get("Authorization");

  if (!reqToken) {
    throw new Error("No token provided");
  }

  try {
    await prisma.tokens.delete({
      where: { token: reqToken },
    });

    return new Response("Logout successful", {
      status: 200,
      headers: {
        "set-cookie": `token=; path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new Response("Token not found", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
