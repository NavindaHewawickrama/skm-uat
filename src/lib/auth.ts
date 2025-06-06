import { cookies } from 'next/headers';

interface JwtPayload {
  nameid: string;
  exp: number;
}

function decodeJWT(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]; // JWT = header.payload.signature
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


export async function refreshAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshtoken')?.value;

    if (!refreshToken) {
      console.error('Refresh token missing');
      return null;
    }

    console.log('🔄 Refreshing access token...');

    const response = await fetch('http://173.212.233.90:8090/api/User/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      console.error('Failed to refresh token:', response.status);
      return null;
    }

    const { accessToken } = await response.json();

    if (typeof accessToken !== 'string') {
      console.error('Invalid access token received');
      return null;
    }

    console.log('✅ Token refreshed successfully');
    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}


export async function getValidAccessToken(): Promise<{
  userId: string | null;
  token: string | null;
  status: number;
  message: string;
}> {
  const cookieStore = await cookies();
  let acctoken = cookieStore.get('acctoken')?.value ?? null;

  if (!acctoken) {
    return { userId: null, token: null, status: 401, message: 'Unauthorized: Token missing' };
  }

  let decoded = decodeJWT(acctoken);

  if (!decoded || !decoded.exp || !decoded.nameid) {
    return { userId: null, token: null, status: 400, message: 'Invalid token' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp < now) {
    acctoken = await refreshAccessToken();
    if (!acctoken) {
      return { userId: null, token: null, status: 401, message: 'Failed to refresh token' };
    }

    decoded = decodeJWT(acctoken);
    if (!decoded || !decoded.nameid) {
      return { userId: null, token: null, status: 400, message: 'Invalid refreshed token' };
    }
  }

  return {
    userId: decoded.nameid,
    token: acctoken,
    status: 200,
    message: 'Retrieved userId successfully',
  };
}
