'use server';

import Route from '@app/models/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
    const token = cookies().get("token");

    await fetch(`${process.env.BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token?.value ?? "",
        },
    });

    redirect(Route.login);
}
