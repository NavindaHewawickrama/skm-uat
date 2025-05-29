import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Clear the cookie by setting it with an expired date
  response.cookies.set('acctoken', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return response;
}
