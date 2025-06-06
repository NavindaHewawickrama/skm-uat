import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }
        const body = await request.json();
        const { orderNumber, statusC, rejectReason } = body;

        const response = await fetch(' http://173.212.233.90:8090/api/Business/ChangeStatus', {
            method: 'POST',
            body: JSON.stringify({ orderNumber, statusC, rejectReason }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(response);

        if (!response.ok) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        //const data = await response.json();

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });

    } catch (error) {
        console.error('Changing order status error:', error);
        return NextResponse.json(
            { error: 'Failed to Change order status' },
            { status: 500 }
        );
    }
}