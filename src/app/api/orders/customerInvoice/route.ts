import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// get orders count
export async function GET(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const body = await request.json();
        const { customerCode } = body;

        // Include userId as query param in API URL
        const response = await fetch(`http://173.212.233.90:8090/api/Business/GetInvoicesByCustomer?customerCode=${customerCode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Failed to fetch orders count', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Error fetching orders count:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders count' },
            { status: 500 }
        );
    }
}