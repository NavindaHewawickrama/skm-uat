import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

// get stock image
export async function GET(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const { searchParams } = new URL(request.url);
        const itemNo = searchParams.get('itemNo');

        // Include userId as query param in API URL
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/item-image?itemNo=${itemNo}`, {
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