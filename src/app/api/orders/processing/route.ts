import { tokenManager } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

// get pending order details
export async function GET() {
    try {
        const result = await tokenManager.getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        // ✅ Include userId as query param in API URL
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetProcessingOrders?userId=${userId}`, {
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
