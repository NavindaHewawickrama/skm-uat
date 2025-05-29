import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, newPassword, confirmPassword } = body;
        const response = await fetch('http://173.212.233.90:8090/api/User/new-password', {
            method: 'POST',
            body: JSON.stringify({ userId, newPassword, confirmPassword }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Password Reset Unsuccessfull' }, { status: 401 });
        }

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Failed to login user' },
            { status: 500 }
        );
    }
}