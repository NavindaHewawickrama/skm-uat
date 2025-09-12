import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/app/lib/auth';
import baseUrl from '../../../config';

export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status: authStatus, message } = result;

        if (authStatus !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status: authStatus });
        }

        const body = await request.json();
        const { orderNumber, status, rejectReason, trackingNumber, deliveryPersonName, deliveryDate, note } = body;

        console.log('Request body:', body);

        // Map the properties to match the API's expected format
        const apiBody = {
            ordernumber: orderNumber,
            status: status,
            rejectReason: rejectReason,
            trackingNumber: trackingNumber,
            delivertPersonName: deliveryPersonName,
            deliveryDate: deliveryDate,
            note: note
        };

        console.log('API body being sent:', apiBody);

        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/ChangeStatus`, {
            method: 'POST',
            body: JSON.stringify(apiBody),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API error response:', errorData);
            return NextResponse.json({
                error: 'Failed to change order status',
                details: errorData
            }, { status: response.status });
        }

        const data = await response.json();
        console.log('API success response:', data);

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Changing order status error:', error);
        return NextResponse.json(
            { error: 'Failed to change order status' },
            { status: 500 }
        );
    }
}