import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';


//create an order
export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;
        // console.log(token);
        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }
        console.log(userId);
        const body = await request.json();
        const { customerCode, locationCode, paymentMethodCode, totalAmount, items } = body;
        console.log(customerCode);
        const response = await fetch(`http://173.212.233.90:8090/api/Business/CreateOrder?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({ customerCode, locationCode, paymentMethodCode, totalAmount, items }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Creating Order Unsuccessful', details: errorText },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: 'Creating Order Succefull' }, { status: 200 });

    } catch (error) {
        console.error('Creating Order error:', error);
        return NextResponse.json(
            { error: 'Failed to Create Order' },
            { status: 500 }
        );
    }
}