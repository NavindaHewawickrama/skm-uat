import { tokenManager } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

export async function GET() {
  try {
    const result = await tokenManager.getValidAccessToken();

    const { userId, token, status, message } = result;

    if (status !== 200 || !token || !userId) {
      return NextResponse.json({ error: message }, { status });
    }

    // Fetch user details from your API
    const response = await fetch(
      `${baseUrl.apiBaseUrl}/api/User/GetUserDetailsById?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.status}`);
    }

    const userData = await response.json();

    // Filter only non-sensitive fields to store in cookie
    const safeUserData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      locationCode: userData.locationCode,
      salesPersonCode: userData.salesPersonCode,
      userRoleId: userData.userRoleId,
      username: userData.username,
    };

    // Set cookie
    const responseWithCookie = NextResponse.json(safeUserData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    responseWithCookie.cookies.set('userDetails', JSON.stringify(safeUserData), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return responseWithCookie;

  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

//created by Navinda Hewawickrama & Praveen Bimsara