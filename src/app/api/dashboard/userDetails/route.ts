import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// get users details for handling
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

    const response = await fetch('http://173.212.233.90:8090/api/Business/GetStockDetails', {
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
    console.error('Error fetching stock details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
