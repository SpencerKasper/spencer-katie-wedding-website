'use server'

import { redirect } from 'next/navigation';

export async function validateAdminAuthorizationRequest(password: string) {
    return password === process.env.NEXT_PUBLIC_ADMIN_WEDDING_PASSWORD;
}