"use server"

import {LoginFormSchema, LoginFormState} from "@/lib/definitions/login-form";
import {createSession, destroySession} from "@/lib/session";
import {redirect} from "next/navigation";
import {adminAuth} from "@/lib/firebase/firebase-admin";

export async function login(_: LoginFormState | undefined, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (validatedFields.error)
        return { errors: validatedFields.error.flatten().fieldErrors }

    const { email, password } = validatedFields.data

    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
    )
    const { idToken } = await res.json()

    if(!idToken) redirect('/login')

    const { uid } = await adminAuth().verifyIdToken(idToken)

    await createSession(uid)
    redirect('/quiz')
}

export async function logout() {
    await destroySession()
    redirect('/')
}