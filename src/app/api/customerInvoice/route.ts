import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log('Customer Invoice API route called!');
    
    try {
        const result = await getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const { searchParams } = new URL(request.url);
        const customerCode = searchParams.get('customerCode');
        
        console.log('Customer Code received:', customerCode);

        if (!customerCode) {
            return NextResponse.json(
                { error: 'Customer Code is required' },
                { status: 400 }
            );
        }

        // Call the external API
        const apiUrl = `http://173.212.233.90:8090/api/Business/GetInvoicesByCustomer?customerId=${customerCode}`;
        console.log('Calling external API:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Failed to fetch customer invoices', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('External API response:', data);
        
        // Transform the response to match your frontend expectations
        const transformedInvoices = data.invoices?.map((invoice: any) => ({
            invoiceNumber: invoice.invoiceNo,
            invoiceDate: invoice.invoiceDate,
            remainingAmount: invoice.totalAmount,
            pdcAmount: invoice.pdcAmount,
            dueAmount: invoice.dueAmount,
        })) || [];

        console.log('Transformed invoices:', transformedInvoices);
        
        // Return just the array of invoices as your frontend expects
        return NextResponse.json(transformedInvoices, { status: 200 });

    } catch (error) {
        console.error('Error in customer invoice API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer invoices', details: error.message },
            { status: 500 }
        );
    }
}