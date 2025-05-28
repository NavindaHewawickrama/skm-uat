import { NextResponse } from 'next/server';

// get roles, locations, sales persons details
export async function GET() {
  try {
    const response = await fetch('http://173.212.233.90:8090/api/User/GetUserCreationDetails', {
      method: 'GET',
      headers: {
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
    console.error('Error fetching user creation details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user creation details' },
      { status: 500 }
    );
  }
}

//created by Praven Bimsara 5/27/2025