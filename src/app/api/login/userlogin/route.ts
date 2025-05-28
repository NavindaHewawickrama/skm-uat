import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get user credentials from request body
    const body = await request.json();

    // Send POST request to external login API
    const response = await fetch('http://173.212.233.90:8090/api/User/login', {
      method: 'POST',
      body: JSON.stringify(body),
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login user' },
      { status: 500 }
    );
  }
}

// Created by Navinda Hewawickrama - 5/27/2025
