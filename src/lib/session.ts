import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import {SessionPayload} from "@/lib/definitions/session";
import {cookies} from "next/headers";
import {cache} from "react";
import {redirect} from "next/navigation";

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload
    } catch {}
}

export async function createSession(uid: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ uid, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function destroySession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export const verifySession = cache(async () => {
    const jwt = (await cookies()).get('session')?.value
    const session = await decrypt(jwt)

    if (!session?.uid) redirect('/login')

    return session
})