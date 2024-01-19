interface IMovie {
  id: number;
  title: string;
  publishingYear: number;
  poster?: string;
}

interface IMoviesResponse {
  movies: IMovie[];
  totalPages: number;
  currentPage: number;
}
