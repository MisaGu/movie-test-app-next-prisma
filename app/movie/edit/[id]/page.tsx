'use server';

import { MovieFormContent } from '@app/components/movie_page/form';
import MovieNotFound from '@app/components/movie_page/not_found';
import Route from '@app/models/routes';
import { redirect } from 'next/navigation';

export default async function Page({ params: { id } }: any) {
    if (Number.isNaN(Number(id))) {
        return <MovieNotFound />;
    } else {
        const movie = await fetch(`${process.env.BASE_URL}/api/movies?id=${id}`, {
            method: 'GET',
            cache: 'no-store',
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                redirect(Route.movieList(1));
            }
        });

        return <MovieFormContent movie={movie} />;
    }
}