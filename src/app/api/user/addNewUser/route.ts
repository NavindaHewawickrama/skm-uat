import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/app/lib/auth';
import baseUrl from '../../../config';

export async function POST(request: Request) {
    try {
        const result = await getValidAccessToken();

        const { userId, token, status, message } = result;

        if (status !== 200 || !token || !userId) {
            return NextResponse.json({ error: message }, { status });
        }

        const body = await request.json();
        const { username, password, reEnteredPassword, firstName, lastName, userRoleId, salesPersonCode, locationCodes, email, phoneNumber, isActive, isMfaEnabled, mfaType } = body;
        const response = await fetch(`${baseUrl.apiBaseUrl}/api/User/AddUser`, {
            method: 'POST',
            body: JSON.stringify({ username, password, reEnteredPassword, firstName, lastName, userRoleId, salesPersonCode, locationCodes, email, phoneNumber, isActive, isMfaEnabled, mfaType }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // if (!response.ok) {
        //     return NextResponse.json({ error: 'Creating User Unsuccefull' }, { status: 401 });
        // }

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Creating User Unsuccessful', details: errorText },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: 'Creating User Succefull' }, { status: 200 });

    } catch (error) {
        console.error('Creating User error:', error);
        return NextResponse.json(
            { error: 'Failed to Create User' },
            { status: 500 }
        );
    }
}