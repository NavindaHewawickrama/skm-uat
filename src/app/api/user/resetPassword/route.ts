import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/app/lib/auth';
import baseUrl from '../../../config';

export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const body = await request.json();
        const { newPassword, confirmPassword } = body;

        // Validate required fields
        if (!userId || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Call your backend API
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/new-password`, {
            method: 'POST',
            body: JSON.stringify({ userId, newPassword, confirmPassword }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle backend response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.message || 'Password reset unsuccessful' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(
            { message: 'Password reset successful', data },
            { status: 200 }
        );

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password. Please try again.' },
            { status: 500 }
        );
    }
}