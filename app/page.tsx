'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Route from './models/routes';


export default async function Page() {
    const authenticationCookie = cookies().get('token');
    if (!!authenticationCookie) {
        redirect(Route.movieList());
    } else {
        redirect(Route.login);
    }
}