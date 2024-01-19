'use server';

import { EmptyMoviesList, FilledMoviesList } from '@app/components/movie_page/list';
import Route from '@app/models/routes';
import { redirect } from 'next/navigation';

export default async function Page({ params: { page } }: any) {
    if (Number.isNaN(Number(page))) {
        redirect(Route.movieList(1));
    }

    const response: IMoviesResponse = await fetch(`${process.env.BASE_URL}/api/movies/page`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
        cache: 'no-store',
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            redirect(Route.login);
        }

        return {
            movies: [],
            totalPages: 0,
            currentPage: 0,
        };
    });

    if (response.totalPages < page) {
        redirect(Route.movieList(page, response.totalPages));
    }

    return response.movies && response.movies?.length > 0
        ? <FilledMoviesList
            movies={response.movies}
            totalPages={response.totalPages}
            currentPage={response.currentPage}
        />
        : <EmptyMoviesList />;
};
