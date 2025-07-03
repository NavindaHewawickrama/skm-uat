import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';


// get pending order details
export async function GET() {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        // ✅ Include userId as query param in API URL
        const response = await fetch(`http://173.212.233.90:8089/api/Business/GetPendingOrders?userId=${userId}`, {
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
        console.error('Error fetching pending orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending orders' },
            { status: 500 }
        );
    }
}
