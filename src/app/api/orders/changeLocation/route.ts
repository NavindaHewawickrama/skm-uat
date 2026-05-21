import { NextResponse } from 'next/server';
import { tokenManager } from '@/app/lib/auth';
import baseUrl from '../../../config';

export async function PUT(request: Request) {
    try {
        const result = await tokenManager.getValidAccessToken();
        const { userId, token, status: authStatus, message } = result;

        if (authStatus !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status: authStatus });
        }

        const body = await request.json();
        const { orderNumber, locationCode } = body;

        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/ChangeLocation`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ordernumber: orderNumber,
                locationcode: locationCode
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            return NextResponse.json(
                { error: 'Failed to change location', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Change location error:', error);
        return NextResponse.json(
            { error: 'Failed to change location' },
            { status: 500 }
        );
    }
}