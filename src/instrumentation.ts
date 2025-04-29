

export async function register() {
    if (process.env.NEXT_RUNTIME === 'edge') {}
    else {
        const firebaseAdminModule = await import("@/lib/firebase/firebase-admin")
        firebaseAdminModule.getFirebaseAdmin()
    }
}