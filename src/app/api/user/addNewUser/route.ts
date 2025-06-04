import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, reEnteredPassword, firstName, lastName, userRoleId, salesPersonCode, locationCode, email, phoneNumber, isActive, isMfaEnabled, mfaType } = body;
        const response = await fetch('http://173.212.233.90:8090/api/User/AddUser', {
            method: 'POST',
            body: JSON.stringify({ username, password, reEnteredPassword, firstName, lastName, userRoleId, salesPersonCode, locationCode, email, phoneNumber, isActive,isMfaEnabled, mfaType }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Creating User Unsuccefull' }, { status: 401 });
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