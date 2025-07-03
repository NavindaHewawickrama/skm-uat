import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';
import baseUrl from '../../../config';

//get users list
export async function GET() {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }


        // ✅ Make request with userId
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/GetAllUsers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error fetching users list:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users list' },
            { status: 500 }
        );
    }
}

//created by Navinda Hewawickrama
