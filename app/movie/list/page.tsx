'use server';

import Route from '@app/models/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
    redirect(Route.movieList());
};
