import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface JwtPayload {
  nameid: string;
  exp: number;
}

// Decode JWT payload safely
function decodeJWT(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
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

    // Decode JWT
    const decoded = decodeJWT(acctoken);
    const userId = decoded?.nameid;
    const exp = decoded?.exp;
    const now = Math.floor(Date.now() / 1000); // current Unix time

    if (!userId || !exp) {
      return NextResponse.json(
        { error: 'Invalid token: userId or expiration missing' },
        { status: 400 }
      );
    }

    // Token expired check
    if (exp < now) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      );
    }

    const maxAge = exp - now;

    // Fetch user details from your API
    const response = await fetch(
      `http://173.212.233.90:8090/api/User/GetUserDetailsById?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${acctoken}`,
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
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge > 0 ? maxAge : 0,
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