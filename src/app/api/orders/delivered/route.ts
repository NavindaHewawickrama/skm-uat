import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// get delivered order details
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const acctoken = cookieStore.get('acctoken')?.value;

        if (!acctoken) {
            return NextResponse.json(
                { error: 'Unauthorized: Token missing' },
                { status: 401 }
            );
        }

        // ✅ Get userId from query string
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Bad Request: userId is required' },
                { status: 400 }
            );
        }

        // ✅ Include userId as query param in API URL
        const response = await fetch(`http://173.212.233.90:8090/api/Business/GetDeliveredOrders?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${acctoken}`,
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
        console.error('Error fetching delivered orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch delivered orders' },
            { status: 500 }
        );
    }
}
