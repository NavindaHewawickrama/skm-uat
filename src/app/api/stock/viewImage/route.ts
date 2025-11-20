import { tokenManager } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

// get stock image
export async function GET(request: Request) {
    try {
        const result = await tokenManager.getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const { searchParams } = new URL(request.url);
        const itemNo = searchParams.get('itemNo');

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
                { error: 'Failed to fetch image', details: errorText },
                { status: response.status }
            );
        }

        const text = await response.text();

        if (!text) {
            return NextResponse.json(
                { error: 'Empty response from downstream service' },
                { status: 502 }
            );
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.log('Response is not JSON, treating as base64 string', parseError);

            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (base64Regex.test(text.trim())) {
                return NextResponse.json(text.trim(), { status: 200 });
            } else {
                console.error('Invalid base64 format:', text.substring(0, 100));
                return NextResponse.json(
                    { error: 'Invalid response format', raw: text.substring(0, 100) },
                    { status: 502 }
                );
            }
        }

        // If it successfully parsed as JSON, return the data
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}