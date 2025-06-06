import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


// Get roles, locations, sales persons details
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userDetailsCookie = cookieStore.get('userDetails')?.value;

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

    return NextResponse.json(
      {
        creationDetails: data,
        userDetails: userDetailsCookie ? JSON.parse(userDetailsCookie) : null,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching user creation details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user creation details' },
      { status: 500 }
    );
  }
}

// Created by Praveen Bimsara 5/27/2025