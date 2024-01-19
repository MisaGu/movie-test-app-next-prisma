'use client';

import { useRouter } from 'next/router';
import Button from '@app/button';
import Route from '@app/models/routes';

export default function MovieNotFound() {
    const router = useRouter();

    return (
        <div className='flex content-center justify-center flex-col h-screen'>
            <div className='m-auto text-center'>
                <h2>Movie not found</h2>
                <Button
                    className='mt-40 font-semibold'
                    label='Back to movie list'
                    type="secondary"
                    onClick={() => router.push(Route.movieList())}
                />
            </div>
        </div>
    );
};