// /app/api/auth/refresh/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshtoken')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    try {
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
        }

        const { accessToken } = await response.json();

        // Save the new token
        const cookieStore = cookies();
        (await cookieStore).set({
            name: 'acctoken',
            value: accessToken, // adjust according to actual token field in API response
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60,
        });

        return NextResponse.json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
    }
}
