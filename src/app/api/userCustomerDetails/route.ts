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

//get customer details based on the user
export async function GET() {
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

    console.log("id", userId);

    // ✅ Make request with userId
    const response = await fetch(`http://173.212.233.90:8090/api/Business/GetOrderCreationDetailsByUser?userId=${userId}`, {
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
    console.error('Error fetching pending orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending orders' },
      { status: 500 }
    );
  }
}
