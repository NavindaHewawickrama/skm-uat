import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usernameOrEmail, password, rememberme } = body;

    const response = await fetch('http://173.212.233.90:8089/api/User/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password, rememberme }),
      headers: {
        'Content-Type': 'application/json',
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
      value: data.acctoken, // adjust according to actual token field in API response
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: rememberme ? 60 * 60 * 24 * 7 : 60 * 60, // 7 days if rememberMe is true
    });

    (await cookieStore).set({
      name: 'refreshtoken',
      value: data.refreshToken, // adjust according to actual token field in API response
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
      { error: 'Failed to login user' },
      { status: 500 }
    );
  }
}

//created by Navinda Hewawickrama and Praveen Bimsara May 2025
