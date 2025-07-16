// File: app/api/stock/route.ts
import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../config';

export async function GET() {
  try {
    const result = await getValidAccessToken();
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


// //File: app/api/stock/route.ts
// import { getValidAccessToken } from '@/lib/auth';
// import { NextResponse } from 'next/server';
// import baseUrl from '../../config';

// export async function GET() {
//   try {
//     const result = await getValidAccessToken();
//     const { userId, token, status, message } = result;

//     if (status !== 200 || !token || !userId) {
//       return NextResponse.json({ error: message }, { status });
//     }

//     const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetStockDetails`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Create NDJSON stream
//     const stream = new ReadableStream({
//       start(controller) {
//         const encoder = new TextEncoder();
//         for (const item of data) {
//           const line = JSON.stringify(item) + "\n";
//           controller.enqueue(encoder.encode(line));
//         }
//         controller.close();
//       }
//     });

//     return new NextResponse(stream, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/x-ndjson',
//         'Transfer-Encoding': 'chunked',
//       },
//     });

//   } catch (error) {
//     console.error('Error streaming stock details:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch stock details' },
//       { status: 500 }
//     );
//   }
// }



// import { getValidAccessToken } from '@/lib/auth';
// import { NextResponse } from 'next/server';
// import baseUrl from '../../config';

// // get stock details
// export async function GET() {
//   try {
//     const result = await getValidAccessToken();
//     const { userId, token, status, message } = result;

//     if (status !== 200 || !token || !userId) {
//       return NextResponse.json({ error: message }, { status });
//     }

//     const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetStockDetails`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const reader = response.body?.getReader();
//     const stream = new ReadableStream({
//       async start(controller) {
//         const decoder = new TextDecoder();
//         while (true) {
//           const { done, value } = await reader!.read();
//           if (done) break;
//           controller.enqueue(decoder.decode(value, { stream: true }));
//         }
//         controller.close();
//       },
//     });

//     return new NextResponse(stream, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Transfer-Encoding': 'chunked', // Ensure the response is chunked
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching stock details:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch stock details' },
//       { status: 500 }
//     );
//   }
// }


// File: app/api/stock/route.ts
// import { getValidAccessToken } from '@/lib/auth';
// import { NextResponse } from 'next/server';
// import baseUrl from '../../config';

// export async function GET() {
//   try {
//     const result = await getValidAccessToken();
//     const { userId, token, status, message } = result;

//     if (status !== 200 || !token || !userId) {
//       return NextResponse.json({ error: message }, { status });
//     }

//     const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetStockDetails`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json(); // Assuming it's an array

//     // Create NDJSON stream
//     const stream = new ReadableStream({
//       start(controller) {
//         for (const item of data) {
//           const line = JSON.stringify(item) + "\n";
//           controller.enqueue(new TextEncoder().encode(line));
//         }
//         controller.close();
//       }
//     });

//     return new NextResponse(stream, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/x-ndjson',
//         'Transfer-Encoding': 'chunked',
//       },
//     });
//   } catch (error) {
//     console.error('Error streaming stock details:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch stock details' },
//       { status: 500 }
//     );
//   }
// }
