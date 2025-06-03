import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface JwtPayload {
    nameid: string;
    // add more fields if needed
}

// Helper to decode base64url to JSON
function decodeJWT(token: string): JwtPayload | null {
    try {
        const payload = token.split('.')[1]; // JWT is [header].[payload].[signature]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const acctoken = cookieStore.get('acctoken')?.value;

        if (!acctoken) {
            return NextResponse.json(
                { error: 'Unauthorized: Token missing' },
                { status: 401 }
            );
        }

        // ✅ Decode token to get userId
        const decoded = decodeJWT(acctoken);
        const userId = decoded?.nameid;

        if (!userId) {
            return NextResponse.json(
                { error: 'Invalid token: userId missing' },
                { status: 400 }
            );
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
        const response = await fetch('http://173.212.233.90:8090/api/User/new-password', {
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