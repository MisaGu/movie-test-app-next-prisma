import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const movieId = Number(url.searchParams.get("id"));

    if (Number.isNaN(movieId)) {
      throw new Error("Invalid movie id");
    }

    const movies = await prisma.movie.findFirst({
      where: { id: movieId },
    });

    return new Response(JSON.stringify(movies), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const reqToken = req.cookies.get("token")?.value;
    await prisma.tokens.findUniqueOrThrow({ where: { token: reqToken } });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
  const moviesPerPage = Number(process.env.MOVIES_PER_PAGE ?? 8);
  const { id, title, publishingYear, poster } = await req.json();

  try {
    /// Create a new movie, will throw an error if the movie already exists
    const movie = await prisma.movie.upsert({
      create: {
        title,
        publishingYear,
        poster: poster ?? '',
      },
      update: {
        title,
        publishingYear,
        poster: poster ?? '',
      },
      where: {
        id: id,
      },
    });

    const movies = (await prisma.movie.findMany()).map((movie) => movie.id);
    const moviesIdx = movies.indexOf(movie.id) + 1;
    const moviePage = Math.ceil(moviesIdx / moviesPerPage);

    return new Response(
      JSON.stringify({ message: "Movie created", moviePage }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new Response(error.message, { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
