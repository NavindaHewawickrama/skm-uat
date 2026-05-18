// import { cookies } from 'next/headers';

// interface JwtPayload {
//   nameid: string;
//   exp: number;
// }

// function decodeJWT(token: string): JwtPayload | null {
//   try {
//     const payload = token.split('.')[1]; // JWT = header.payload.signature
//     const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (err) {
//     console.error("Invalid token:", err);
//     return null;
//   }
// }


// export async function refreshAccessToken(): Promise<string | null> {
//   try {
//     const cookieStore = await cookies();
//     const refreshToken = cookieStore.get('refreshtoken')?.value;

//     if (!refreshToken) {
//       console.error('Refresh token missing');
//       return null;
//     }

//  //   console.log('🔄 Refreshing access token...');

//     const response = await fetch('http://173.212.233.90:8090/api/User/refresh-token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ refreshToken })
//     });

//     if (!response.ok) {
//       console.error('Failed to refresh token:', response.status);
//       return null;
//     }

//     const { accessToken } = await response.json();

//     if (typeof accessToken !== 'string') {
//       console.error('Invalid access token received');
//       return null;
//     }

//   //  console.log('✅ Token refreshed successfully');
//     return accessToken;
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     return null;
//   }
// }


// export async function getValidAccessToken(): Promise<{
//   userId: string | null;
//   token: string | null;
//   status: number;
//   message: string;
// }> {
//   const cookieStore = await cookies();
//   let acctoken = cookieStore.get('acctoken')?.value ?? null;

//   if (!acctoken) {
//    // console.log('❌ No access token in cookies');
//     return { userId: null, token: null, status: 401, message: 'Unauthorized: Token missing' };
//   }

//   let decoded = decodeJWT(acctoken);

//   if (!decoded || !decoded.exp || !decoded.nameid) {
//    // console.log('❌ Invalid token in cookies');
//     return { userId: null, token: null, status: 400, message: 'Invalid token' };
//   }

//   const now = Math.floor(Date.now() / 1000);
//   if (decoded.exp < now) {
//     acctoken = await refreshAccessToken();
//     if (!acctoken) {
//      // console.log('❌ Failed to refresh cookies');
//       return { userId: null, token: null, status: 401, message: 'Failed to refresh token' };
//     }

//     decoded = decodeJWT(acctoken);
//     if (!decoded || !decoded.nameid) {
//      // console.log('❌ Invalid token in cookies after refresh');
//       return { userId: null, token: null, status: 400, message: 'Invalid refreshed token' };
//     }
//   }

//   return {
//     userId: decoded.nameid,
//     token: acctoken,
//     status: 200,
//     message: 'Retrieved userId successfully',
//   };
// }
// lib/auth.ts
import { cookies } from 'next/headers';
import baseUrl from '../config';

interface JwtPayload {
  nameid: string;
  exp: number;
  iat?: number;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string | null> | null = null;
  private isRefreshing = false;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private decodeJWT(token: string): JwtPayload | null {
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

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshtoken')?.value;

      if (!refreshToken) {
        console.error('Refresh token missing');
        return null;
      }

      const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/refresh-token`, {
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

      // Note: In Next.js server components, we can't set cookies directly like in client-side
      // The cookie setting should be handled by the client or middleware
      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  public async getValidAccessToken(): Promise<{
    userId: string | null;
    token: string | null;
    status: number;
    message: string;
  }> {
    const cookieStore = await cookies();
    const acctoken = cookieStore.get('acctoken')?.value ?? null;

    if (!acctoken) {
      return { userId: null, token: null, status: 401, message: 'Unauthorized: Token missing' };
    }

    const decoded = this.decodeJWT(acctoken);
    if (!decoded || !decoded.exp || !decoded.nameid) {
      return { userId: null, token: null, status: 400, message: 'Invalid token' };
    }

    const now = Math.floor(Date.now() / 1000);
    const fifteenMinutesInSeconds = 15 * 60;
    const timeUntilExpiry = decoded.exp - now;

    // If token doesn't need refresh, return it immediately
    if (timeUntilExpiry >= fifteenMinutesInSeconds) {
      return {
        userId: decoded.nameid,
        token: acctoken,
        status: 200,
        message: 'Retrieved token successfully',
      };
    }

    // If we're already refreshing, wait for the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      console.log('Token refresh already in progress, waiting...');
      const newToken = await this.refreshPromise;
      
      if (newToken) {
        const newDecoded = this.decodeJWT(newToken);
        return {
          userId: newDecoded?.nameid || null,
          token: newToken,
          status: 200,
          message: 'Token refreshed (from ongoing refresh)',
        };
      }
    }

    // Start a new refresh process
    this.isRefreshing = true;
    this.refreshPromise = this.refreshAccessToken();

    try {
      const newToken = await this.refreshPromise;
      
      if (newToken) {
        const newDecoded = this.decodeJWT(newToken);
        return {
          userId: newDecoded?.nameid || null,
          token: newToken,
          status: 200,
          message: 'Token refreshed successfully',
        };
      } else if (timeUntilExpiry > 0) {
        // Refresh failed but token is still valid
        console.warn('Refresh failed but token still valid, using existing token');
        return {
          userId: decoded.nameid,
          token: acctoken,
          status: 200,
          message: 'Using existing token (refresh failed but token still valid)',
        };
      } else {
        return { userId: null, token: null, status: 401, message: 'Failed to refresh expired token' };
      }
    } finally {
      // Reset refreshing state
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }
}

export const tokenManager = TokenManager.getInstance();

// For backward compatibility
export async function getValidAccessToken() {
  return tokenManager.getValidAccessToken();
}