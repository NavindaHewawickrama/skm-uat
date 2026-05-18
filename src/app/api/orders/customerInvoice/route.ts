
// import { tokenManager } from '@/app/lib/auth';
// import { NextResponse } from 'next/server';
// import baseUrl from '../../../config';

// interface Invoice {
//     invoiceNo: string;
//     orderNo: string;
//     postedDate: string;
//     pdcAmount: number;
//     dueAmount: number;
//     totalAmount: number;
//     remainingAmount: number;
// }


// // get customer invoices
// export async function GET(request: Request) {
//     try {
//         const result = await tokenManager.getValidAccessToken();

//         const { userId, token, status, message } = result;

//         if (status !== 200 || !token || !userId) {
//             return NextResponse.json({ error: message }, { status });
//         }

//         // Get customerCode from URL query parameters (changed from customerId to customerCode)
//         const { searchParams } = new URL(request.url);
//         const customerCode = searchParams.get('customerCode');

//         if (!customerCode) {
//             return NextResponse.json(
//                 { error: 'Customer Code is required' },
//                 { status: 400 }
//             );
//         }

//         // Use customerCode as customerId in the API call (assuming the backend expects customerId)
//         const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             return NextResponse.json(
//                 { error: 'Failed to fetch customer invoices', details: errorText },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();

//         // Transform the invoices while preserving the original structure
//         const transformedInvoices = data.invoices?.map((invoice: Invoice) => ({
//             invoiceNo: invoice.invoiceNo,
//             orderNo: invoice.orderNo,
//             invoiceDate: invoice.postedDate,
//             pdcAmount: invoice.pdcAmount,
//             dueAmount: invoice.dueAmount,
//             totalAmount: invoice.totalAmount,
//             remainigAmount: invoice.remainingAmount,
//         })) || [];

//         // Return the complete response structure that your frontend expects
//         const responseData = {
//             customerNo: data.customerNo,
//             totalDueAmount: data.totalDueAmount,
//             totalPdcAmount: data.totalPdcAmount,
//             invoices: transformedInvoices
//         };

//         return NextResponse.json(responseData, { status: 200 });

//     } catch (error) {
//         console.error('Error fetching customer invoices:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch customer invoices' },
//             { status: 500 }
//         );
//     }
// }
import { tokenManager } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

interface Invoice {
    invoiceNo: string;
    orderNo: string;
    postedDate: string;
    pdcAmount: number;
    dueAmount: number;
    totalAmount: number;
    remainingAmount: number;
}

interface ExternalApiResponse {
    customerNo?: string;
    totalDueAmount?: number;
    totalPdcAmount?: number;
    invoices?: Invoice[];
    [key: string]: unknown;
}

interface ErrorResponse {
    error: string;
    message: string;
    code?: string;
    customerCode?: string;
    details?: string;
    statusCode?: number;
    timestamp?: string;
    cloudflareError?: boolean;
}

// Global timeout for external API calls (120 seconds)
const EXTERNAL_API_TIMEOUT = 120000;

// Get customer invoices
export async function GET(request: Request) {
    try {
        const result = await tokenManager.getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            const errorResponse: ErrorResponse = {
                error: 'Authentication failed',
                message: message || 'Invalid credentials'
            };
            return NextResponse.json(errorResponse, { status });
        }

        // Get customerCode from URL query parameters
        const { searchParams } = new URL(request.url);
        const customerCode = searchParams.get('customerCode');

        if (!customerCode) {
            const errorResponse: ErrorResponse = {
                error: 'Validation error',
                message: 'Customer Code is required',
                code: 'MISSING_CUSTOMER_CODE'
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        // Use customerCode as customerId in the API call
        const apiUrl = `${baseUrl.apiBaseUrl}/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`;
        console.log('Calling invoices API:', apiUrl);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('Invoices API timeout after', EXTERNAL_API_TIMEOUT, 'ms');
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
                    console.error('Invoices fetch aborted due to timeout');
                    const timeoutResponse: ErrorResponse = {
                        error: 'External API timeout',
                        message: 'The invoice service is taking too long to respond.',
                        code: 'TIMEOUT',
                        customerCode,
                        timestamp: new Date().toISOString()
                    };
                    return NextResponse.json(timeoutResponse, { status: 504 });
                }
                
                // Network errors
                console.error('Network error calling invoices API:', error.message);
                const networkErrorResponse: ErrorResponse = {
                    error: 'Network error',
                    message: 'Cannot connect to the invoice service.',
                    code: 'NETWORK_ERROR',
                    customerCode,
                    details: error.message
                };
                return NextResponse.json(networkErrorResponse, { status: 503 });
            }
            
            // Unknown error type
            console.error('Unknown error type in fetch:', error);
            const unknownErrorResponse: ErrorResponse = {
                error: 'Connection error',
                message: 'An unexpected connection error occurred.',
                code: 'UNKNOWN_ERROR',
                customerCode
            };
            return NextResponse.json(unknownErrorResponse, { status: 503 });
        }

        // Check response status and content type
        const contentType = response.headers.get('content-type') || '';
        
        // Handle HTML responses (Cloudflare error pages)
        if (contentType.includes('text/html')) {
            const htmlText = await response.text();
            console.error('Received HTML instead of JSON. Status:', response.status);
            
            // Check for Cloudflare specific errors
            if (htmlText.includes('524') || htmlText.includes('Cloudflare')) {
                const cloudflareResponse: ErrorResponse = {
                    error: 'Service timeout',
                    message: 'The invoice server timed out.',
                    code: 'CLOUDFLARE_524',
                    cloudflareError: true,
                    customerCode
                };
                return NextResponse.json(cloudflareResponse, { status: 504 });
            }
            
            const htmlErrorResponse: ErrorResponse = {
                error: 'Invalid response format',
                message: 'Received HTML instead of JSON response',
                code: 'INVALID_RESPONSE',
                customerCode
            };
            return NextResponse.json(htmlErrorResponse, { status: 502 });
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
            
            console.error('Invoices API error:', response.status, errorDetails.substring(0, 500));
            
            const apiErrorResponse: ErrorResponse = {
                error: 'External API error',
                message: `Invoice service returned error: ${response.status}`,
                details: errorDetails.substring(0, 1000),
                statusCode: response.status,
                customerCode
            };
            
            return NextResponse.json(
                apiErrorResponse, 
                { status: response.status >= 500 ? 503 : response.status }
            );
        }

        // Parse successful JSON response
        let data: ExternalApiResponse;
        try {
            data = await response.json() as ExternalApiResponse;
        } catch (parseError: unknown) {
            console.error('Failed to parse invoices JSON response:', parseError);
            const parseErrorResponse: ErrorResponse = {
                error: 'Invalid response',
                message: parseError instanceof Error 
                    ? `Failed to parse response: ${parseError.message}`
                    : 'The invoice service returned invalid data format.',
                code: 'INVALID_JSON',
                customerCode
            };
            return NextResponse.json(parseErrorResponse, { status: 502 });
        }

        // Validate response structure
        if (!data || typeof data !== 'object') {
            console.error('Invalid invoices response structure:', data);
            const structureErrorResponse: ErrorResponse = {
                error: 'Invalid data format',
                message: 'The invoice service returned unexpected data format.',
                code: 'INVALID_STRUCTURE',
                customerCode
            };
            return NextResponse.json(structureErrorResponse, { status: 502 });
        }

        // Transform the invoices while preserving the original structure
        const transformedInvoices = data.invoices?.map((invoice: Invoice) => ({
            invoiceNo: invoice.invoiceNo || 'N/A',
            orderNo: invoice.orderNo || 'N/A',
            invoiceDate: invoice.postedDate || '',
            pdcAmount: invoice.pdcAmount || 0,
            dueAmount: invoice.dueAmount || 0,
            totalAmount: invoice.totalAmount || 0,
            remainigAmount: invoice.remainingAmount || 0, // Note: typo in property name 'remainigAmount'
        })) || [];

        // Return the complete response structure that your frontend expects
        const responseData = {
            customerNo: data.customerNo || customerCode,
            totalDueAmount: data.totalDueAmount || 0,
            totalPdcAmount: data.totalPdcAmount || 0,
            invoices: transformedInvoices,
            count: transformedInvoices.length,
            timestamp: new Date().toISOString()
        };

        console.log(`Successfully fetched ${transformedInvoices.length} invoices for customer ${customerCode}`);

        return NextResponse.json(responseData, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error: unknown) {
        console.error('Unexpected error in invoices API:', error);
        
        const internalErrorResponse: ErrorResponse = {
            error: 'Internal server error',
            message: error instanceof Error 
                ? error.message 
                : 'An unexpected error occurred',
            code: 'INTERNAL_ERROR',
            timestamp: new Date().toISOString()
        };
        
        return NextResponse.json(internalErrorResponse, { status: 500 });
    }
}