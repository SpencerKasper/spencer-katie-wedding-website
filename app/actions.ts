'use server'

import { redirect } from 'next/navigation';

export async function validateAdminAuthorizationRequest(password: string) {
    return password === process.env.ADMIN_WEDDING_PASSWORD;
}