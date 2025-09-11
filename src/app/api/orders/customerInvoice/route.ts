import { getValidAccessToken } from '@/lib/auth';
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


// get customer invoices
export async function GET(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        // Get customerCode from URL query parameters (changed from customerId to customerCode)
        const { searchParams } = new URL(request.url);
        const customerCode = searchParams.get('customerCode');

        if (!customerCode) {
            return NextResponse.json(
                { error: 'Customer Code is required' },
                { status: 400 }
            );
        }

        // Use customerCode as customerId in the API call (assuming the backend expects customerId)
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Failed to fetch customer invoices', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Transform the invoices while preserving the original structure
        const transformedInvoices = data.invoices?.map((invoice: Invoice) => ({
            invoiceNo: invoice.invoiceNo,
            orderNo: invoice.orderNo,
            invoiceDate: invoice.postedDate,
            pdcAmount: invoice.pdcAmount,
            dueAmount: invoice.dueAmount,
            totalAmount: invoice.totalAmount,
            remainigAmount: invoice.remainingAmount,
        })) || [];

        // Return the complete response structure that your frontend expects
        const responseData = {
            customerNo: data.customerNo,
            totalDueAmount: data.totalDueAmount,
            totalPdcAmount: data.totalPdcAmount,
            invoices: transformedInvoices
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('Error fetching customer invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer invoices' },
            { status: 500 }
        );
    }
}