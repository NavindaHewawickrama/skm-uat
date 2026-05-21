import { tokenManager } from '../../../lib/auth';
import { NextResponse } from 'next/server';
import baseUrl from '../../../config';

export async function GET(request: Request) {
    try {
        const result = await tokenManager.getValidAccessToken();
        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        // Get documentUrl from query parameters
        const { searchParams } = new URL(request.url);
        const documentUrl = searchParams.get('documentUrl');

        if (!documentUrl) {
            return NextResponse.json({ error: 'documentUrl required' }, { status: 400 });
        }

        // Call the download API
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/Business/download?documentUrl=${encodeURIComponent(documentUrl)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Download failed' }, { status: response.status });
        }

        // Return the file directly
        const fileBuffer = await response.arrayBuffer();
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
                'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Download failed' }, { status: 500 });
    }
}