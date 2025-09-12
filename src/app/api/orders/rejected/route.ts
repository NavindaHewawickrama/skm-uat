
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/app/lib/auth';
import baseUrl from '../../../config';

// get rejected order details
export async function GET() {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        // ✅ Include userId as query param in API URL
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetRejectedOrders?userId=${userId}`, {
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
        console.error('Error fetching rejected orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rejected orders' },
            { status: 500 }
        );
    }
}

//created by Navinda Hewawickrama & Praveen Bimsara