// File: app/api/stock/route.ts
import { tokenManager } from '../../lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../config';

export async function GET() {
  try {
    const result = await tokenManager.getValidAccessToken();
    const { userId, token, status, message } = result;

    if (status !== 200 || !token || !userId) {
      return NextResponse.json({ error: message }, { status });
    }

    const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetStockDetails`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Regular JSON array

    return NextResponse.json(data); // Send the full array
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}

