import { getValidAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Upload a document
export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

       // console.log('UserId:', userId);

        const formData = await request.formData();

        const apiFormData = new FormData();

        apiFormData.append('UserId', userId.toString());

        const document = formData.get('Document') as File;
        if (!document) {
            return NextResponse.json(
                { error: 'Document file is required' },
                { status: 400 }
            );
        }

        // Add the document to the API form data
        apiFormData.append('Document', document);

   //     console.log('Uploading document:', document.name);

        const response = await fetch(`http://173.212.233.90:8089/api/Business/UploadUserDocument`, {
            method: 'POST',
            body: apiFormData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Document upload unsuccessful', details: errorText },
                { status: response.status }
            );
        }

        const responseData = await response.json();
        return NextResponse.json({
            message: 'Document upload successful',
            data: responseData
        }, { status: 200 });

    } catch (error) {
        console.error('Document upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload document' },
            { status: 500 }
        );
    }
}