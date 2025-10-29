// app/api/orders/getCustomerDueAmount/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/app/lib/auth';
import baseUrl from '../../../config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const result = await getValidAccessToken();
    const { userId, token, status, message } = result;

    if (status !== 200 || !token || !userId) {
      return NextResponse.json({ error: message }, { status });
    }

    const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetDueAmountByCustomer?customerNo=${customerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error fetching customer due amount:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer due amount' },
      { status: 500 }
    );
  }
}