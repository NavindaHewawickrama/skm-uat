import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface JwtPayload {
    nameid: string;
    // add more fields if needed
}

// Helper to decode base64url to JSON
function decodeJWT(token: string): JwtPayload | null {
    try {
        const payload = token.split('.')[1]; // JWT is [header].[payload].[signature]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}


//create an order
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

        // ✅ Decode token to get userId
        const decoded = decodeJWT(acctoken);
        const userId = decoded?.nameid;

        if (!userId) {
            return NextResponse.json(
                { error: 'Invalid token: userId missing' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { customerCode, locationCode, paymentMethodCode, totalAmount, items } = body;
        const response = await fetch(`http://173.212.233.90:8090/api/Business/CreateOrder?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({ customerCode, locationCode, paymentMethodCode, totalAmount, items }),
            headers: {
                'Authorization': `Bearer ${acctoken}`,
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