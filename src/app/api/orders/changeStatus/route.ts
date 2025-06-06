import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const acctoken = cookieStore.get('acctoken')?.value;

        if (!acctoken) {
            return NextResponse.json(
                { error: 'Unauthorized: Token missing' },
                { status: 401 }
            );
        }
        const body = await request.json();
        const { orderNumber, status, rejectReason } = body;

        const response = await fetch(' http://173.212.233.90:8090/api/Business/ChangeStatus', {
            method: 'POST',
            body: JSON.stringify({ orderNumber, status, rejectReason }),
            headers: {
                'Authorization': `Bearer ${acctoken}`,
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