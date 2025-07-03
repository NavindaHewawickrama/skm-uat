import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

//create an order
export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const body = await request.json();
        const { customerCode, locationCode, paymentMethodCode, totalAmount, items } = body;

        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/CreateOrder?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({ customerCode, locationCode, paymentMethodCode, totalAmount, items }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log(response);
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Creating Order Unsuccessful', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Creating Order error:', error);
        return NextResponse.json(
            { error: 'Failed to Create Order' },
            { status: 500 }
        );
    }
}