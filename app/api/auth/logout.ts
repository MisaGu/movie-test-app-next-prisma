import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken {
  userLogin: string;
  userId: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = req.cookies; // Assuming the JWT token is stored in a cookie named "token"

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    var decodedToken: DecodedToken;

    // Verify the JWT token
    try {
      decodedToken = jwt.verify(
        token,
        process.env.PRIVATE_KEY || ""
      ) as DecodedToken;
    } catch (error) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get the user ID from the decoded token
    const userId = decodedToken.userId;

    // Check if the user is authenticated
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Perform logout logic here (e.g., invalidate the token, update user's last logout timestamp, etc.)

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
