import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reqToken = headers().get("Authorization");

    if (!reqToken) {
      throw new Error("No token provided");
    }

    /// If the token is not found, this will throw an error
    await prisma.tokens.findUniqueOrThrow({
      where: { token: reqToken },
    });
    return new Response(JSON.stringify({ isAuthenticated: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ isAuthenticated: false }), {
      status: 401,
    });
  }
}
