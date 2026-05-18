import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import baseUrl from '../../../config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usernameOrEmail, password, rememberme } = body;

    // Get client IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    // Get the first IP from x-forwarded-for (client's real IP)
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : realIp || 'unknown';
    console.log(clientIp);

    const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/login`, {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password, rememberme }),
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': clientIp,
      },
    });
    //console.log(response);

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const data = await response.json();

    // ✅ Store token in HttpOnly cookie
    const cookieStore = cookies();
    (await cookieStore).set({
      name: 'acctoken',
      value: data.acctoken,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: rememberme ? 60 * 60 * 24 * 7 : 60 * 60, // 7 days if rememberMe is true
    });

    (await cookieStore).set({
      name: 'refreshtoken',
      value: data.refToken,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: rememberme ? 60 * 60 * 24 * 7 : 60 * 60, // 7 days if rememberMe is true
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error ? error : 'Failed to login user' },
      { status: 500 }
    );
  }
}

//created by Navinda Hewawickrama and Praveen Bimsara May 2025
