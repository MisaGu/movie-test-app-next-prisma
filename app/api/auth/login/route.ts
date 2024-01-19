import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response("Bad Request", { status: 400 });
  }

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email: email },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    /// To hash a password
    // const hash = bcrypt.hashSync(password, 10);

    // Hash the password
    const matchedPassword = await bcrypt.compare(password, user.password);

    // Perform password validation here
    if (!matchedPassword) {
      return new Response("Wrong password", { status: 401 });
    }
    // If password is valid, generate and return a token
    const token = generateToken(user.email, user.id);

    await prisma.tokens.upsert({
      create: {
        token,
        userId: user.id,
      },
      update: {
        token,
      },
      where: {
        userId: user.id,
      },
    });

    return new Response("Login successful", {
      status: 200,
      headers: {
        "set-cookie": `token=${token}; path=/; HttpOnly; SameSite=Strict; Max-Age=3600; Secure`,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new Response("User not found", { status: 404 });
    }
    return new Response(
      typeof error == "string" ? error : "Internal Server Error",
      { status: 500 }
    );
  }
}

function generateToken(userLogin: string, userId: number): string {
  const privateKey = process.env.PRIVATE_KEY || "";
  const token = jwt.sign({ login: userLogin, id: userId }, privateKey, {
    expiresIn: "1h",
  });

  return token;
}
