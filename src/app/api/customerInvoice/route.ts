// import { tokenManager } from '@/app/lib/auth';
// import { NextResponse } from 'next/server';
// import baseUrl from '../../config';

// interface Invoice {
//     invoiceNo: string;
//     orderNo: string;
//     invoiceDate: string;
//     pdcAmount: number;
//     dueAmount: number;
//     totalAmount: number;
//     originalAmount: number;
//     balanceBeforePDCs: number;
//     releasedPDCs: number;
//     balanceAfterPDCs: number;
//     postedDate: string;
//     orderedDate: string;
// }


// export async function GET(request: Request) {
//     console.log('Customer Invoice API route called!');

//     try {
//         const result = await tokenManager.getValidAccessToken();
//         const { userId, token, status, message } = result;

//         if (status !== 200 || !token || !userId) {
//             return NextResponse.json({ error: message }, { status });
//         }

//         const { searchParams } = new URL(request.url);
//         const customerCode = searchParams.get('customerCode');

//         console.log('Customer Code received:', customerCode);

//         if (!customerCode) {
//             return NextResponse.json(
//                 { error: 'Customer Code is required' },
//                 { status: 400 }
//             );
//         }

//         // Call the external API
//         const apiUrl = `${baseUrl.apiBaseUrl}/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`;
//         console.log('Calling external API:', apiUrl);

//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('External API error:', response.status, errorText);
//             return NextResponse.json(
//                 { error: 'Failed to fetch customer invoices', details: errorText },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         //console.log('External API response:', data);

//         // Transform the response to match your frontend expectations
//         const transformedInvoices = data.invoices?.map((invoice: Invoice) => ({
//             totalDueAmount: data.totalDueAmount,
//             invoiceNumber: invoice.invoiceNo,
//             orderDate: invoice.orderedDate,
//             invoiceDate: invoice.postedDate,
//             totalAmount: invoice.totalAmount,
//             pdcAmount: invoice.pdcAmount,
//             dueAmount: invoice.dueAmount,
//             orderNo: invoice.orderNo,
//             originalAmount: invoice.originalAmount,
//             balanceBeforePDCs: invoice.balanceBeforePDCs,
//             releasedPDCs: invoice.releasedPDCs,
//             balanceAfterPDCs: invoice.balanceAfterPDCs
//         })) || [];

//         //console.log('Transformed invoices:', transformedInvoices);

//         // Return just the array of invoices as your frontend expects
//         return NextResponse.json(transformedInvoices, { status: 200 });

//     } catch (error) {
//         console.error('Error in customer invoice API:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch customer invoices' },
//             { status: 500 }
//         );
//     }
// }

import { tokenManager } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../config';

interface Invoice {
    invoiceNo: string;
    orderNo: string;
    invoiceDate: string;
    pdcAmount: number;
    dueAmount: number;
    totalAmount: number;
    originalAmount: number;
    balanceBeforePDCs: number;
    releasedPDCs: number;
    balanceAfterPDCs: number;
    postedDate: string;
    orderedDate: string;
}

interface ExternalApiResponse {
    invoices?: Invoice[];
    totalDueAmount?: number;
    [key: string]: unknown;
}

interface ErrorResponse {
    error: string;
    message: string;
    code?: string;
    details?: string;
    statusCode?: number;
    cloudflareError?: boolean;
    suggestedAction?: string;
}

// Global timeout for external API calls (120 seconds - just over Cloudflare's 100s)
const EXTERNAL_API_TIMEOUT = 120000; // 120 seconds

export async function GET(request: Request) {
    console.log('Customer Invoice API route called!');

    try {
        const result = await tokenManager.getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            const errorResponse: ErrorResponse = {
                error: 'Authentication failed',
                message: message || 'Invalid authentication credentials'
            };
            return NextResponse.json(errorResponse, { status });
        }

        const { searchParams } = new URL(request.url);
        const customerCode = searchParams.get('customerCode');

        console.log('Customer Code received:', customerCode);

        if (!customerCode) {
            const errorResponse: ErrorResponse = {
                error: 'Validation error',
                message: 'Customer Code is required',
                code: 'MISSING_CUSTOMER_CODE'
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        // Call the external API with timeout
        const apiUrl = `${baseUrl.apiBaseUrl}/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`;
        console.log('Calling external API:', apiUrl);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('External API timeout after', EXTERNAL_API_TIMEOUT, 'ms');
            controller.abort();
        }, EXTERNAL_API_TIMEOUT);

        let response: Response;
        try {
            response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId); // Clear timeout if fetch completes
        } catch (error: unknown) {
            clearTimeout(timeoutId); // Ensure timeout is cleared
            
            // Type-safe error handling
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error('Fetch aborted due to timeout');
                    const timeoutError: ErrorResponse = {
                        error: 'External API timeout',
                        message: 'The invoice service is taking too long to respond. Please try again later.',
                        code: 'TIMEOUT',
                        suggestedAction: 'Try again in 5 minutes or contact support'
                    };
                    return NextResponse.json(timeoutError, { status: 504 });
                }
                
                // Network errors (no connection, DNS failure, etc.)
                console.error('Network error calling external API:', error.message);
                const networkError: ErrorResponse = {
                    error: 'Network error',
                    message: 'Cannot connect to the invoice service. Please check your connection.',
                    code: 'NETWORK_ERROR',
                    details: error.message
                };
                return NextResponse.json(networkError, { status: 503 });
            }
            
            // Unknown error type
            console.error('Unknown error type in fetch:', error);
            const unknownError: ErrorResponse = {
                error: 'Connection error',
                message: 'An unexpected connection error occurred.',
                code: 'UNKNOWN_ERROR'
            };
            return NextResponse.json(unknownError, { status: 503 });
        }

        // Check response status and content type
        const contentType = response.headers.get('content-type') || '';
        
        // Handle HTML responses (Cloudflare error pages)
        if (contentType.includes('text/html')) {
            const htmlText = await response.text();
            console.error('Received HTML instead of JSON. Status:', response.status);
            
            // Check for Cloudflare specific errors
            if (htmlText.includes('524') || htmlText.includes('Cloudflare')) {
                const cloudflareError: ErrorResponse = {
                    error: 'Service timeout',
                    message: 'The invoice server timed out. This is usually temporary.',
                    code: 'CLOUDFLARE_524',
                    cloudflareError: true
                };
                return NextResponse.json(cloudflareError, { status: 504 });
            }
            
            const htmlError: ErrorResponse = {
                error: 'Invalid response format',
                message: 'Received HTML instead of JSON response',
                code: 'INVALID_RESPONSE'
            };
            return NextResponse.json(htmlError, { status: 502 });
        }

        // Handle non-OK responses
        if (!response.ok) {
            let errorDetails = '';
            try {
                // Try to get JSON error if available
                const errorData = await response.json() as Record<string, unknown>;
                errorDetails = JSON.stringify(errorData);
            } catch {
                // Fall back to text if not JSON
                errorDetails = await response.text();
            }
            
            console.error('External API error:', response.status, errorDetails.substring(0, 500));
            
            const apiError: ErrorResponse = {
                error: 'External API error',
                message: `Invoice service returned error: ${response.status}`,
                details: errorDetails.substring(0, 1000),
                statusCode: response.status
            };
            
            return NextResponse.json(
                apiError, 
                { status: response.status >= 500 ? 503 : response.status }
            );
        }

        // Parse successful JSON response
        let data: ExternalApiResponse;
        try {
            data = await response.json() as ExternalApiResponse;
        } catch (parseError: unknown) {
            console.error('Failed to parse JSON response:', parseError);
            const parseErrorResponse: ErrorResponse = {
                error: 'Invalid response',
                message: parseError instanceof Error 
                    ? `Failed to parse response: ${parseError.message}`
                    : 'The invoice service returned invalid data format.',
                code: 'INVALID_JSON'
            };
            return NextResponse.json(parseErrorResponse, { status: 502 });
        }

        // Validate response structure
        if (!data || typeof data !== 'object') {
            console.error('Invalid response structure:', data);
            const structureError: ErrorResponse = {
                error: 'Invalid data format',
                message: 'The invoice service returned unexpected data format.',
                code: 'INVALID_STRUCTURE'
            };
            return NextResponse.json(structureError, { status: 502 });
        }

        // Transform the response to match your frontend expectations
        const transformedInvoices = data.invoices?.map((invoice: Invoice) => ({
            totalDueAmount: data.totalDueAmount || 0,
            invoiceNumber: invoice.invoiceNo || 'N/A',
            orderDate: invoice.orderedDate || '',
            invoiceDate: invoice.postedDate || '',
            totalAmount: invoice.totalAmount || 0,
            pdcAmount: invoice.pdcAmount || 0,
            dueAmount: invoice.dueAmount || 0,
            orderNo: invoice.orderNo || 'N/A',
            originalAmount: invoice.originalAmount || 0,
            balanceBeforePDCs: invoice.balanceBeforePDCs || 0,
            releasedPDCs: invoice.releasedPDCs || 0,
            balanceAfterPDCs: invoice.balanceAfterPDCs || 0
        })) || [];

        console.log(`Successfully transformed ${transformedInvoices.length} invoices`);

        // Return just the array of invoices as your frontend expects
        return NextResponse.json(transformedInvoices, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0' // Prevent caching of potentially stale data
            }
        });

    } catch (error: unknown) {
        console.error('Unexpected error in customer invoice API:', error);
        
        const internalError: ErrorResponse = {
            error: 'Internal server error',
            message: error instanceof Error 
                ? error.message 
                : 'An unexpected error occurred',
            code: 'INTERNAL_ERROR'
        };
        
        return NextResponse.json(internalError, { status: 500 });
    }
}