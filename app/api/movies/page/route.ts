import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { page } = await req.json();
  const moviesPerPage = Number(process.env.MOVIES_PER_PAGE ?? 8);
  try {
    if (Number.isNaN(Number(page))) {
      throw new Error("Invalid page number");
    }

    const moviesTotal = await prisma.movie.count();
    const totalPages = Math.ceil(moviesTotal / moviesPerPage);
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const skip = (currentPage - 1) * moviesPerPage;
    const take = moviesPerPage;

    const movies = await prisma.movie.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify({ movies, totalPages, currentPage }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
