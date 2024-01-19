'use server';

import Route from '@app/models/routes';
import { isAuthenticated } from '@app/utils/server_services';
import { redirect } from 'next/navigation';


export default async function Layout({ children }: any) {
    const _isAuthenticated = await isAuthenticated();
    if (_isAuthenticated) {
        redirect(Route.movieList());
    }

    return children;
}
